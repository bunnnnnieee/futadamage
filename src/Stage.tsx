import { ReactElement } from "react";
import { StageBase, StageResponse, Message, InitialData } from "@chub-ai/stages-ts";

interface MessageState {
  msgCount: number;
  stage: "white" | "green" | "purple" | "golden" | "red";
}

export default class StageImpl extends StageBase<any, any, MessageState, any> {
  state: MessageState = { msgCount: 0, stage: "white" };

  constructor(data: InitialData<any, any, MessageState, any>) {
    super(data);
    this.state = data.messageState ?? { msgCount: 0, stage: "white" };
  }

  private getStage(count: number) {
    if (count >= 75) return "red";
    if (count >= 45) return "golden";
    if (count >= 25) return "purple";
    if (count >= 10) return "green";
    return "white";
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    this.state.msgCount += 1;
    this.state.stage = this.getStage(this.state.msgCount);

    // Example: inject stage prefix only
    userMessage.content = `[${this.state.stage}] ` + userMessage.content;
    return { messageState: this.state };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    return { messageState: this.state };
  }

  render(): ReactElement {
    return (
      <div style={{ padding: "10px", background: "#000", color: "#fff" }}>
        <div>Stage: {this.state.stage.toUpperCase()}</div>
        <div>Messages: {this.state.msgCount}</div>
      </div>
    );
  }
}