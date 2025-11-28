import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

// --- Types for state ---
type MessageStateType = any;
type ConfigType = any;
type InitStateType = any;
type ChatStateType = any;

// --- New Stage Skeleton ---
export class NewStage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {
  myInternalState: { [key: string]: any };

  constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
    super(data);
    // Initialize internal state
    this.myInternalState = data.messageState || {
      stage: 'newStage',
      counters: { white: 0, green: 0, purple: 0, golden: 0, red: 0 },
      affection: 0,
    };
  }

  async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
    // Called once when the stage loads
    return { success: true, error: null, initState: null, chatState: null };
  }

  async setState(state: MessageStateType): Promise<void> {
    if (state != null) this.myInternalState = { ...this.myInternalState, ...state };
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    // Called before sending user message to AI
    return { messageState: this.myInternalState };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    // Called after receiving AI message
    return { messageState: this.myInternalState };
  }

  render(): ReactElement {
    // Render minimal empty div (or add scene UI later)
    return <div></div>;
  }
}