// stages/stage.tsx
import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

type MessageStateType = any;
type ConfigType = any;
type InitStateType = any;
type ChatStateType = any;

export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {
  myInternalState: { [key: string]: any };

  constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
    super(data);
    const { users, characters, messageState } = data;

    // Initialize state
    this.myInternalState = messageState || {
      stage: 'white',
      counters: { white: 0, green: 0, purple: 0, golden: 0, red: 0 },
      affection: 0
    };

    this.myInternalState.numUsers = Object.keys(users).length;
    this.myInternalState.numChars = Object.keys(characters).length;
  }

  async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
    return { success: true };
  }

  async setState(state: MessageStateType): Promise<void> {
    if (state) this.myInternalState = { ...this.myInternalState, ...state };
  }

  // Stage words (example; expand as needed)
  stageWords = {
    white: { adjectives: ["friendly","happy"], nouns: ["day","chat"], verbs: ["talk","smile"] },
    green: { adjectives: ["warm","sweet"], nouns: ["friend","moment"], verbs: ["enjoy","share"] },
    purple: { adjectives: ["naughty","flirty"], nouns: ["lover","partner"], verbs: ["tease","kiss"] },
    golden: { adjectives: ["affectionate","bold"], nouns: ["partner","dom"], verbs: ["kiss","caress"] },
    red: { adjectives: ["obsessive","lustful"], nouns: ["slave","pet"], verbs: ["fuck","punish"] }
  };

  // Pick random element helper
  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    const content = userMessage.content;

    // --- Stage progression counters ---
    const stageThresholds = { white: 10, green: 25, purple: 45, golden: 65, red: 1000 };
    const stage = this.myInternalState.stage;
    this.myInternalState.counters[stage] += 1;

    // --- Calculate total messages for progression ---
    const totalMessages =
      this.myInternalState.counters.white +
      this.myInternalState.counters.green +
      this.myInternalState.counters.purple +
      this.myInternalState.counters.golden +
      this.myInternalState.counters.red;

    if (totalMessages >= stageThresholds.red) this.myInternalState.stage = 'red';
    else if (totalMessages >= stageThresholds.golden) this.myInternalState.stage = 'golden';
    else if (totalMessages >= stageThresholds.purple) this.myInternalState.stage = 'purple';
    else if (totalMessages >= stageThresholds.green) this.myInternalState.stage = 'green';
    else this.myInternalState.stage = 'white';

    // --- Affection keywords detection ---
    const keywords: { [key: string]: string[] } = {
      compliment: ["beautiful","handsome","cute","pretty","lovely","adorable"],
      romantic: ["i love you","i adore you","marry me","kiss","hug"],
      rude: ["fuck you","shut up","i hate you","idiot","stupid"],
      flirt: ["sexy","hot","tease","wink","tempting"]
    };

    Object.values(keywords).forEach(list => {
      if (list.some(word => content.toLowerCase().includes(word))) {
        this.myInternalState.affection += 2;
      }
    });

    // --- Secret logic: cannot reveal until purple ---
    if (this.myInternalState.stage !== 'purple' && content.toLowerCase().includes('secret')) {
      userMessage.content = "I can't tell you that yet.";
    }

    return { messageState: this.myInternalState };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    return { messageState: this.myInternalState };
  }

  render(): ReactElement {
    return <div></div>; // Minimal render to satisfy .tsx requirement
  }
}