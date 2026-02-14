import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingContainer } from '../OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SetupOverviewStep() {
  const { goNext } = useOnboarding();
  const [recommendedModel, setRecommendedModel] = useState<string>('gemma3:1b');
  const [modelSize, setModelSize] = useState<string>('~806 MB');
  const [isMac, setIsMac] = useState(false);

  // Fetch recommended model on mount
  useEffect(() => {
    const fetchRecommendedModel = async () => {
      try {
        const model = await invoke<string>('builtin_ai_get_recommended_model');
        setRecommendedModel(model);
        setModelSize(model === 'gemma3:4b' ? '~2.5 GB' : '~806 MB');
      } catch (error) {
        console.error('Failed to get recommended model:', error);
        // Keep default gemma3:1b
      }
    };
    fetchRecommendedModel();

    // Detect platform for totalSteps
    const checkPlatform = async () => {
      try {
        const { platform } = await import('@tauri-apps/plugin-os');
        setIsMac(platform() === 'macos');
      } catch (e) {
        setIsMac(navigator.userAgent.includes('Mac'));
      }
    };
    checkPlatform();
  }, []);

  const steps = [
    {
      number: 1,
      type: 'transcription',
      title: '文字起こしエンジンをダウンロード',
    },
    {
      number: 2,
      type: 'summarization',
      title: '要約エンジンをダウンロード',
    },
  ];

  const handleContinue = () => {
    goNext();
  };

  return (
    <OnboardingContainer
      title="セットアップ概要"
      description="Meetily を使用するには、文字起こしと要約のAIモデルをダウンロードする必要があります。"
      step={2}
      totalSteps={isMac ? 4 : 3}
    >
      <div className="flex flex-col items-center space-y-10">
        {/* Steps Card */}
        <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-4">
            {steps.map((step, idx) => {
              return (
                <div
                  key={step.number}
                  className={`flex items-start gap-4 p-1`}
                >
                  <div className="flex-1 ml-1">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        ステップ {step.number} :  {step.title}

                        {step.type === "summarization" && (
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Info className="w-4 h-4" />
                                </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs text-sm">
                                設定から OpenAI、Claude、Ollama などの外部AIプロバイダーを
                                要約生成に使用することもできます。
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        )}
                        </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* CTA Section */}
        <div className="w-full max-w-xs space-y-4">
          <Button
            onClick={handleContinue}
            className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white"
          >
            始めましょう
          </Button>
          <div className="text-center">
            <a
              href="https://github.com/Zackriya-Solutions/meeting-minutes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 hover:underline"
            >
              GitHub で問題を報告
            </a>
          </div>
        </div>
      </div>
    </OnboardingContainer>
  );
}
