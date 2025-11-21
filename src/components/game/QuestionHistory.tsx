import { QuestionAnswer } from '@/types/game';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionHistoryProps {
  history: QuestionAnswer[];
  questionCount: number;
}

export function QuestionHistory({ history, questionCount }: QuestionHistoryProps) {
  return (
    <div className="w-full max-w-2xl">
      <div className="brutal-border bg-card p-4 xl:p-6 shadow-brutal">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl xl:text-3xl font-black text-foreground max-sm:text-xl">
            QUESTION HISTORY
          </h2>
          <div className="text-xl xl:text-2xl font-black text-secondary max-sm:text-lg">
            {questionCount}/20
          </div>
        </div>

        <ScrollArea className="h-64 xl:h-80 max-sm:h-48">
          {history.length === 0 ? (
            <p className="text-muted-foreground text-center py-8 font-bold">
              No questions yet...
            </p>
          ) : (
            <div className="space-y-3">
              {[...history].reverse().map((item, reverseIndex) => {
                const index = history.length - 1 - reverseIndex;
                return (
                  <div
                    key={index}
                    className="brutal-border bg-background p-3 xl:p-4 space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-black text-secondary min-w-8">
                        Q{index + 1}:
                      </span>
                      <p className="font-bold text-foreground flex-1">
                        {item.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pl-10">
                      <span className="font-black text-accent">A:</span>
                      <span
                        className={`font-black px-3 py-1 brutal-border text-sm ${
                          item.answer === 'Yes'
                            ? 'bg-accent text-accent-foreground'
                            : item.answer === 'No'
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-muted text-foreground'
                        }`}
                      >
                        {item.answer.toUpperCase()}
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
