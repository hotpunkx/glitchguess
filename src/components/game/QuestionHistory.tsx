import { QuestionAnswer } from '@/types/game';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionHistoryProps {
  history: QuestionAnswer[];
  questionCount: number;
}

export function QuestionHistory({ history, questionCount }: QuestionHistoryProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="neubrutal-border bg-white text-black p-3 shadow-neubrutal flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-2 border-b-2 border-black pb-1 shrink-0">
          <h2 className="text-sm font-black uppercase tracking-tighter italic">
            HISTORY log
          </h2>
          <div className="text-[10px] font-black text-brand uppercase">
            {questionCount} total
          </div>
        </div>

        <ScrollArea className="flex-1 select-none">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4 opacity-30">
              <span className="text-2xl mb-1">📼</span>
              <p className="text-[8px] font-black uppercase italic">
                Empty log...
              </p>
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {[...history].reverse().map((item, reverseIndex) => {
                const index = history.length - 1 - reverseIndex;
                const isAI = item.asker === 'ai';
                return (
                  <div
                    key={index}
                    className="neubrutal-border bg-[#f8f8f8] p-2 space-y-1 relative shadow-neubrutal transform transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`px-1.5 py-0.5 text-[8px] font-black uppercase ${isAI ? 'bg-brand text-white' : 'bg-accentPink text-black'}`}>
                        {isAI ? 'AI' : 'YOU'}
                      </div>
                      <p className="font-bold text-[10px] flex-1 leading-tight uppercase">
                        {item.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pl-8">
                      <span
                        className={`font-black px-2 py-0.5 neubrutal-border text-[8px] uppercase ${
                          item.answer === 'Yes'
                            ? 'bg-accentGreen text-black'
                            : item.answer === 'No'
                              ? 'bg-accentPink text-black'
                              : 'bg-[#eeeeee] text-black'
                        }`}
                      >
                        {item.answer}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
