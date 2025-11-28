import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";

type Rarity = "white" | "green" | "purple" | "golden" | "red";

interface StageState {
  stage: Rarity;
  counters: Record<Rarity, number>;
  affection: number;
}

export class Stage extends StageBase<any, any, StageState, any> {
  private myInternalState: StageState;

  private stageWords: Record<Rarity, { adjectives: string[]; nouns: string[]; verbs: string[] }> = {
    white: { adjectives: ["cute"], nouns: ["baby"], verbs: ["hug"] },
    green: { adjectives: ["good"], nouns: ["boy"], verbs: ["praise"] },
    purple: { adjectives: ["naughty"], nouns: ["pet"], verbs: ["tease"] },
    golden: { adjectives: ["obedient"], nouns: ["girl"], verbs: ["train"] },
    red: { adjectives: ["ruined"], nouns: ["slave"], verbs: ["dominate"] }
  };

  constructor(data: InitialData<any, any, StageState, any>) {
    super(data);
    this.myInternalState = data.messageState ?? {
      stage: "white",
      counters: { white: 0, green: 0, purple: 0, golden: 0, red: 0 },
      affection: 50
    };
  }

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private updateStageFromCounters() {
    const total =
      this.myInternalState.counters.white +
      this.myInternalState.counters.green +
      this.myInternalState.counters.purple +
      this.myInternalState.counters.golden +
      this.myInternalState.counters.red;

    if (total >= 1000) this.myInternalState.stage = "red";
    else if (total >= 65) this.myInternalState.stage = "golden";
    else if (total >= 45) this.myInternalState.stage = "purple";
    else if (total >= 25) this.myInternalState.stage = "green";
    else this.myInternalState.stage = "white";
  }

  private updateAffection(content: string) {
    const lower = content.toLowerCase();
    if (["cute","pretty"].some(w => lower.includes(w))) this.myInternalState.affection += 3;
    if (["hot","sexy"].some(w => lower.includes(w))) this.myInternalState.affection += 5;
    if (["stupid","bitch"].some(w => lower.includes(w))) this.myInternalState.affection -= 4;
    this.myInternalState.affection = Math.max(0, Math.min(100, this.myInternalState.affection));
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, StageState>>> {
    const currentStage = this.myInternalState.stage;
    this.myInternalState.counters[currentStage]++;
    this.updateStageFromCounters();
    this.updateAffection(userMessage.content);

    // DO NOT modify userMessage.content in v1!

    return { messageState: this.myInternalState };
  }

  async afterResponse(): Promise<Partial<StageResponse<any, StageState>>> {
    return { messageState: this.myInternalState };
  }

  render(): ReactElement {
    return <div></div>;
  }
}