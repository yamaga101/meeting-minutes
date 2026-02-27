"""Google Sheets exporter for meeting action items.

Exports ImmediateActionItems, NextSteps, and CriticalDeadlines
from meeting summaries to the ToDo Tracker spreadsheet.
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path

import gspread
from google.oauth2.service_account import Credentials

logger = logging.getLogger(__name__)

SPREADSHEET_ID = "1fEQp7jbcpHKcKCUrU0JreX4Xs20P1f0viNOkKpwNNng"
TODO_SHEET_NAME = "ToDo"
SOURCE_LABEL = "Meetily"

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
]

CREDENTIALS_PATH = Path(__file__).parent.parent / "credentials" / "service_account.json"


def _get_time_slot() -> str:
    """Return a time-slot label based on current hour."""
    hour = datetime.now().hour
    if hour < 6:
        return "深夜〜朝"
    if hour < 12:
        return "朝〜昼"
    if hour < 18:
        return "昼〜夕"
    return "夕〜夜"


class SheetsExporter:
    """Export meeting action items to Google Sheets ToDo Tracker."""

    def __init__(self) -> None:
        self._client: gspread.Client | None = None

    def _get_client(self) -> gspread.Client:
        if self._client is not None:
            return self._client

        creds_path = os.environ.get("GOOGLE_SA_CREDENTIALS", str(CREDENTIALS_PATH))
        if not Path(creds_path).exists():
            raise FileNotFoundError(
                f"Service account credentials not found at {creds_path}. "
                "Place the JSON key file there or set GOOGLE_SA_CREDENTIALS env var."
            )

        creds = Credentials.from_service_account_file(creds_path, scopes=SCOPES)
        self._client = gspread.authorize(creds)
        return self._client

    def export(self, summary_json: str | dict, meeting_name: str = "") -> int:
        """Export action items from a summary to the ToDo sheet.

        Args:
            summary_json: The summary data (JSON string or dict).
            meeting_name: Fallback meeting name if not in summary.

        Returns:
            Number of rows appended.
        """
        if isinstance(summary_json, str):
            summary = json.loads(summary_json)
        else:
            summary = summary_json

        rows = self._extract_rows(summary, meeting_name)
        if not rows:
            logger.info("No action items to export to Sheets")
            return 0

        client = self._get_client()
        spreadsheet = client.open_by_key(SPREADSHEET_ID)
        sheet = self._get_or_create_sheet(spreadsheet)

        sheet.append_rows(rows, value_input_option="USER_ENTERED")
        logger.info(f"Exported {len(rows)} action items to ToDo Tracker")
        return len(rows)

    def _get_or_create_sheet(self, spreadsheet: gspread.Spreadsheet) -> gspread.Worksheet:
        """Get the ToDo sheet, creating it with headers if missing."""
        try:
            return spreadsheet.worksheet(TODO_SHEET_NAME)
        except gspread.WorksheetNotFound:
            sheet = spreadsheet.add_worksheet(title=TODO_SHEET_NAME, rows=1000, cols=10)
            headers = [
                "Date", "Source", "Priority", "Task", "Detail",
                "Assignee", "Deadline", "Status", "Registered", "ソース",
            ]
            sheet.append_row(headers)
            sheet.format("1:1", {"textFormat": {"bold": True}})
            sheet.freeze(rows=1)
            return sheet

    def _extract_rows(self, summary: dict, meeting_name: str) -> list[list[str]]:
        """Extract ToDo rows from summary sections."""
        title = summary.get("MeetingName") or meeting_name or "Unknown"
        date_str = datetime.now().strftime("%Y-%m-%d")
        time_slot = _get_time_slot()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        rows: list[list[str]] = []

        # ImmediateActionItems → priority=high
        rows.extend(
            self._section_to_rows(
                summary.get("ImmediateActionItems", {}),
                title, date_str, time_slot, now_str, priority="high",
            )
        )

        # CriticalDeadlines → priority=high
        rows.extend(
            self._section_to_rows(
                summary.get("CriticalDeadlines", {}),
                title, date_str, time_slot, now_str, priority="high",
            )
        )

        # NextSteps → priority=medium
        rows.extend(
            self._section_to_rows(
                summary.get("NextSteps", {}),
                title, date_str, time_slot, now_str, priority="medium",
            )
        )

        return rows

    def _section_to_rows(
        self,
        section: dict,
        title: str,
        date_str: str,
        time_slot: str,
        now_str: str,
        priority: str,
    ) -> list[list[str]]:
        """Convert a summary section into spreadsheet rows."""
        blocks = section.get("blocks", [])
        if not blocks:
            return []

        rows: list[list[str]] = []
        for block in blocks:
            content = block.get("content", "").strip()
            if not content:
                continue
            # Skip headings — only export actual items
            if block.get("type") in ("heading1", "heading2"):
                continue

            rows.append([
                date_str,       # Date
                title,          # Source (meeting title)
                priority,       # Priority
                content,        # Task
                "",             # Detail
                "",             # Assignee
                "",             # Deadline
                "未着手",        # Status
                now_str,        # Registered
                SOURCE_LABEL,   # ソース (Meetily)
            ])

        return rows
