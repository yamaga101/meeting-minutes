'use client';

import React from 'react';
import { X, Info, Shield } from 'lucide-react';

interface AnalyticsDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDisable: () => void;
}

export default function AnalyticsDataModal({ isOpen, onClose, onConfirmDisable }: AnalyticsDataModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">収集するデータ</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">プライバシーは保護されています</p>
                <p><strong>匿名の利用データのみ</strong>を収集します。会議内容、名前、個人情報は一切収集されません。</p>
              </div>
            </div>
          </div>

          {/* Data Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">収集するデータ:</h3>

            {/* Model Preferences */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">1. モデル設定</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• 文字起こしモデル（例: "Whisper large-v3", "Parakeet"）</li>
                <li>• 要約モデル（例: "Llama 3.2", "Claude Sonnet"）</li>
                <li>• モデルプロバイダー（例: "ローカル", "Ollama", "OpenRouter"）</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2 italic">ユーザーが好むモデルの理解に役立ちます</p>
            </div>

            {/* Meeting Metrics */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">2. 匿名の会議メトリクス</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• 録音時間（例: "125秒"）</li>
                <li>• 一時停止時間（例: "5秒"）</li>
                <li>• 文字起こしセグメント数</li>
                <li>• 処理された音声チャンク数</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2 italic">パフォーマンスの最適化と利用パターンの理解に役立ちます</p>
            </div>

            {/* Device Types */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">3. デバイスタイプ（名前ではありません）</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• マイクタイプ: "Bluetooth" / "有線" / "不明"</li>
                <li>• システム音声タイプ: "Bluetooth" / "有線" / "不明"</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2 italic">互換性の改善に役立ちます（実際のデバイス名は収集しません）</p>
            </div>

            {/* Usage Patterns */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">4. アプリ利用パターン</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• アプリの起動/停止イベント</li>
                <li>• セッション時間</li>
                <li>• 機能の使用状況（例: "設定変更"）</li>
                <li>• エラーの発生（バグ修正に役立ちます）</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2 italic">ユーザー体験の改善に役立ちます</p>
            </div>

            {/* Platform Info */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">5. プラットフォーム情報</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• OS（例: "macOS", "Windows"）</li>
                <li>• アプリバージョン（全イベントに自動付与）</li>
                <li>• アーキテクチャ（例: "x86_64", "aarch64"）</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2 italic">プラットフォームサポートの優先順位付けに役立ちます</p>
            </div>
          </div>

          {/* What We DON'T Collect */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">収集しないデータ:</h4>
            <ul className="text-sm text-red-800 space-y-1 ml-4">
              <li>• ❌ 会議名やタイトル</li>
              <li>• ❌ 会議の文字起こしや内容</li>
              <li>• ❌ 音声録音</li>
              <li>• ❌ デバイス名（タイプのみ: Bluetooth/有線）</li>
              <li>• ❌ 個人情報</li>
              <li>• ❌ 識別可能なデータ</li>
            </ul>
          </div>

          {/* Example Event */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">イベントの例:</h4>
            <pre className="text-xs text-gray-700 overflow-x-auto">
              {`{
  "event": "meeting_ended",
  "app_version": "0.2.1",
  "transcription_provider": "parakeet",
  "transcription_model": "parakeet-tdt-0.6b-v3-int8",
  "summary_provider": "ollama",
  "summary_model": "llama3.2:latest",
  "total_duration_seconds": "125.5",
  "microphone_device_type": "Wired",
  "system_audio_device_type": "Bluetooth",
  "chunks_processed": "150",
  "had_fatal_error": "false"
}`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            分析を有効のままにする
          </button>
          <button
            onClick={onConfirmDisable}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            分析を無効にする
          </button>
        </div>
      </div>
    </div>
  );
}
