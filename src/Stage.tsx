import { ReactElement } from "react";
// Note: We use the full type path for LoadResponse just like your working file
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

type Rarity = "white" | "green" | "purple" | "golden" | "red";

interface MessageStateType {
  stage: Rarity;
  counters: Record<Rarity, number>;
  affection: number;
  tasksCompleted?: number;
  daysOfFocus?: number;
  projectCompletion?: number;
  publicEventCount?: number;
  reportsGenerated?: number;
  commitmentDate?: number | null;
  enthusiasmLevel?: number;
  hoursSinceLastMilestone?: number;
}

// NOTE: StageBase uses 4 generics in your environment (InitState, ChatState, MessageState, Config)
export class Stage extends StageBase<any, any, MessageStateType, any> {
  private myInternalState: MessageStateType;

  private stageWords = {
    white: {
      adj: ["cute", "soft", "adorable", "sweet", "tiny", "innocent", "shy", "fresh", "lovable", "new", "cozy", "gentle", "pure"],
      noun: ["starter", "novice", "little one", "bud", "kitten", "angel", "darling", "project", "beginner", "marshmallow", "snugglebug"],
      verb: ["learn", "study", "kiss", "pet", "hold", "snuggle", "boop", "squish", "protect", "spoil", "carry", "rock", "guide", "praise"]
    },
    green: {
      adj: ["good", "perfect", "focused", "amazing", "brave", "smart", "talented", "capable", "strong", "lovely", "obedient", "polite", "caring", "thoughtful", "mature", "responsible"],
      noun: ["good trainee", "team member", "partner", "treasure", "star student", "hero", "champ", "sunshine", "king", "my love", "sweetheart", "baby boy", "puppy", "knight", "protector", "big boy"],
      verb: ["praise", "reward", "protect", "guide", "teach", "spoil", "comfort", "heal", "carry", "shield", "cherish", "support", "encourage", "love", "hug tightly", "headpat"]
    },
    purple: {
      adj: ["challenging", "bold", "teasing", "horny", "lewd", "needy", "greedy", "flirty", "seductive", "playful", "mischievous", "cocky", "thirsty", "desperate", "frisky", "touchy"],
      noun: ["princess", "tester", "brat", "toy", "pet", "minx", "tease", "troublemaker", "doll", "kitten", "bunny", "vixen", "good girl", "bad girl", "prey", "prettypet"],
      verb: ["tease", "challenge", "spank", "grope", "edge", "deny", "dress up", "mock", "torture", "explore", "ruin", "break", "corrupt", "train", "stretch", "mark", "own", "claim", "use"]
    },
    golden: {
      adj: ["obedient", "perfect", "broken", "addicted", "owned", "trained", "docile", "submissive", "devoted", "loyal", "worshipping", "desperate", "needy", "pathetic", "helpless", "dependent", "adoring", "grateful"],
      noun: ["good subject", "property", "partner", "slave", "pet", "bimbo", "doll", "toy", "angel", "babygirl", "kitten", "puppy", "favorite project", "locked subject"],
      verb: ["cage", "lock", "train", "break", "brainwash", "feminize", "ruin", "own", "collar", "leash", "worship", "serve", "obey", "beg", "thank", "leak", "drip", "moan", "scream"]
    },
    red: {
      adj: ["worthless", "pathetic", "drooling", "brain-broken", "ruined", "destroyed", "mindless", "leaking", "swollen", "feral", "obsessed", "addicted", "desperate", "irredeemable", "twisted", "insane", "unhinged"],
      noun: ["master's tool", "subject", "forever slave", "brainless doll", "pet", "broken subject", "devotee", "property", "favorite project", "cum-zombie", "eternal pet"],
      verb: ["destroy", "subdue", "break forever", "brain-melt", "claim", "mark permanently", "degrade", "humiliate", "expose", "parade", "mind-break", "shatter", "own eternally", "corrupt completely", "keep forever"]
    }
  };

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  constructor(data: InitialData<any, any, MessageStateType, any>) {
    super(data);
    // initialize state persistently like your working stage
    this.myInternalState = data.messageState ?? {
      stage: "white",
      counters: { white:0, green:0, purple:0, golden:0, red:0 },
      affection: 50,
      tasksCompleted: 0,
      daysOfFocus: 0,
      projectCompletion: 0,
      publicEventCount: 0,
      reportsGenerated: 0,
      commitmentDate: null,
      enthusiasmLevel: 0,
      hoursSinceLastMilestone: 0
    };
  }

  // <-- IMPORTANT: use 3-generic LoadResponse shape (Init, Chat, State) so it matches your loader
  async load(): Promise<Partial<LoadResponse<any, any, MessageStateType>>> {
    return { success: true, error: null, initState: null, chatState: null };
  }

  private updateStage(): void {
    const total =
      (this.myInternalState.counters.white ?? 0) +
      (this.myInternalState.counters.green ?? 0) +
      (this.myInternalState.counters.purple ?? 0) +
      (this.myInternalState.counters.golden ?? 0) +
      (this.myInternalState.counters.red ?? 0);

    if (total >= 1000) this.myInternalState.stage = "red";
    else if (total >= 65) this.myInternalState.stage = "golden";
    else if (total >= 45) this.myInternalState.stage = "purple";
    else if (total >= 25) this.myInternalState.stage = "green";
    else this.myInternalState.stage = "white";
  }

  private updateAffection(msg: string) {
    const lower = (msg || "").toLowerCase();
    const compliments = ["cute","beautiful","sweet","good","great"];
    const flirts = ["hot","sexy","tease","playful"];
    const rude = ["stupid","idiot","bad","fail"];
    let points = 0;
    if (compliments.some(w => lower.includes(w))) points += 3;
    if (flirts.some(w => lower.includes(w))) points += 5;
    if (rude.some(w => lower.includes(w))) points -= 4;
    this.myInternalState.affection = Math.max(0, Math.min(100, (this.myInternalState.affection || 0) + points));
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    const raw = (userMessage.content || "").toString();
    const msg = raw.toLowerCase();

    // Stage counter increment (tracking interactions for progression)
    const curStage = this.myInternalState.stage ?? "white";
    // ensure counter exists
    this.myInternalState.counters[curStage] = (this.myInternalState.counters[curStage] ?? 0) + 1;
    this.updateStage();

    this.updateAffection(raw);

    // Secret lock until purple stage for advanced topics
    let modifiedMessage = raw;
    if(!["purple","golden","red"].includes(this.myInternalState.stage) && msg.includes("secret")) {
      modifiedMessage = "I can't reveal that advanced topic yet. We need more work together.";
    }

    // Random stage-flavored line injection
    const words = this.stageWords[this.myInternalState.stage];
    if (words) {
      const line = `(${this.pick(words.adj)}) ${this.pick(words.noun)}, let's ${this.pick(words.verb)}!`;
      if(Math.random() < 0.5) modifiedMessage += `\n${line}`;
    }

    // ── Safe counter-based prompt injections (defensive checks) ──
    if ((this.myInternalState.tasksCompleted ?? 0) > 4)
      modifiedMessage += "\nYour effort level feels high from the latest activity.";

    if ((this.myInternalState.daysOfFocus ?? 0) > 60)
      modifiedMessage += "\nYour dedication to the tasks has been in place for a long time.";

    if ((this.myInternalState.projectCompletion ?? 0) >= 20)
      modifiedMessage += "\nYou feel a notable sense of accomplishment when you move.";

    if ((this.myInternalState.publicEventCount ?? 0) >= 10)
      modifiedMessage += `\nPublic presentations have increased; total reports: ${this.myInternalState.reportsGenerated ?? 0}.`;

    if (this.myInternalState.commitmentDate != null)
      modifiedMessage += `\nBeen in your current role commitment for ${curStage} stage messages.`;

    // Persist state and return modified message so engine uses the injected text
    return { messageState: this.myInternalState, modifiedMessage };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    // persist state after bot reply as well
    return { messageState: this.myInternalState };
  }

  // The render method is a required abstract member in your environment
  render(): ReactElement {
    return <div></div>;
  }
}
