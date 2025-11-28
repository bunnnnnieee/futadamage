import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

// Defines the progression levels
type Rarity = "white" | "green" | "purple" | "golden" | "red";

// Defines the internal state structure using safe, functional placeholders
interface MessageStateType {
  stage: Rarity;
  counters: Record<Rarity, number>;
  affection: number;
  tasksCompleted?: number;      // Placeholder for activity counter 1
  daysOfFocus?: number;         // Placeholder for activity counter 2
  projectCompletion?: number;   // Placeholder for activity counter 3
  publicEventCount?: number;    // Placeholder for activity counter 4
  reportsGenerated?: number;    // Placeholder for activity counter 5
  commitmentDate?: number | null; // Placeholder for commitment date
  enthusiasmLevel?: number;     // Placeholder for dedication level
  hoursSinceLastMilestone?: number; // Placeholder for time elapsed
}

export class Stage extends StageBase<any, any, MessageStateType, any> {
  private myInternalState: MessageStateType;

  // ────────────────────── WORD POOLS (Safe & Neutral) ──────────────────────
  // These pools progress from gentle/new to devoted/intense.
  private stageWords = {
    white: { // Initial/Gentle
      adj: ["cute", "soft", "adorable", "sweet", "tiny", "innocent", "shy", "fresh", "lovable", "new", "cozy", "gentle", "pure"],
      noun: ["starter", "novice", "little one", "bud", "kitten", "angel", "darling", "project", "beginner", "marshmallow", "snugglebug"],
      verb: ["learn", "study", "kiss", "pet", "hold", "snuggle", "boop", "squish", "protect", "spoil", "carry", "rock", "guide", "praise"]
    },
    green: { // Growth/Good
      adj: ["good", "perfect", "focused", "amazing", "brave", "smart", "talented", "capable", "strong", "lovely", "obedient", "polite", "caring", "thoughtful", "mature", "responsible"],
      noun: ["good trainee", "team member", "partner", "treasure", "star student", "hero", "champ", "sunshine", "king", "my love", "sweetheart", "baby boy", "puppy", "knight", "protector", "big boy"],
      verb: ["praise", "reward", "protect", "guide", "teach", "spoil", "comfort", "heal", "carry", "shield", "cherish", "support", "encourage", "love", "hug tightly", "headpat"]
    },
    purple: { // Challenging/Intense
      adj: ["challenging", "bold", "teasing", "horny", "lewd", "needy", "greedy", "flirty", "seductive", "playful", "mischievous", "cocky", "thirsty", "desperate", "frisky", "touchy"],
      noun: ["princess", "tester", "brat", "toy", "pet", "minx", "tease", "troublemaker", "doll", "kitten", "bunny", "vixen", "good girl", "bad girl", "prey", "prettypet"],
      verb: ["tease", "challenge", "spank", "grope", "edge", "deny", "dress up", "mock", "torture", "explore", "ruin", "break", "corrupt", "train", "stretch", "mark", "own", "claim", "use"]
    },
    golden: { // Submission/Mastered
      adj: ["obedient", "perfect", "broken", "addicted", "owned", "trained", "docile", "submissive", "devoted", "loyal", "worshipping", "desperate", "needy", "pathetic", "helpless", "dependent", "adoring", "grateful"],
      noun: ["good subject", "property", "partner", "slave", "pet", "bimbo", "doll", "toy", "angel", "babygirl", "kitten", "puppy", "favorite project", "locked subject"],
      verb: ["cage", "lock", "train", "break", "brainwash", "feminize", "ruin", "own", "collar", "leash", "worship", "serve", "obey", "beg", "thank", "leak", "drip", "moan", "scream"]
    },
    red: { // Permanent/Ruined
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

  async load(): Promise<Partial<LoadResponse<any, any, MessageStateType>>> {
    // Stage load logic goes here if needed, but for now, it just confirms success.
    return { success: true };
  }

  private updateStage(): void {
    // Logic to determine the current Rarity stage based on total interactions.
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

  private updateAffection(msg: string) {
    const lower = msg.toLowerCase();
    const compliments = ["cute","beautiful","sweet","good","great"];
    const flirts = ["hot","sexy","tease","playful"];
    const rude = ["stupid","idiot","bad","fail"];
    let points = 0;
    // Positive keywords add points
    compliments.some(w=>lower.includes(w))&&(points+=3);
    flirts.some(w=>lower.includes(w))&&(points+=5);
    // Negative keywords subtract points
    rude.some(w=>lower.includes(w))&&(points-=4);

    // Update affection, ensuring it stays between 0 and 100.
    this.myInternalState.affection = Math.max(0, Math.min(100, this.myInternalState.affection + points));
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    const msg = userMessage.content.toLowerCase();

    // Stage counter increment (tracking interactions for progression)
    const curStage = this.myInternalState.stage;
    this.myInternalState.counters[curStage]++;
    this.updateStage();

    this.updateAffection(userMessage.content);

    // Secret lock until purple stage for advanced topics
    if(!["purple","golden","red"].includes(this.myInternalState.stage) && msg.includes("secret")) {
      userMessage.content = "I can't reveal that advanced topic yet. We need more work together.";
    }

    // Random stage-flavored line injection
    const words = this.stageWords[this.myInternalState.stage];
    const line = `(${this.pick(words.adj)}) ${this.pick(words.noun)}, let's ${this.pick(words.verb)}!`;
    if(Math.random()<0.5) userMessage.content += `\n${line}`;

    // ── Safe counter-based prompt injections ──
    if(this.myInternalState.tasksCompleted!>4)
      userMessage.content += "\nYour effort level feels high from the latest activity.";

    if(this.myInternalState.daysOfFocus!>60)
      userMessage.content += "\nYour dedication to the tasks has been in place for a long time.";

    if(this.myInternalState.projectCompletion!>=20)
      userMessage.content += "\nYou feel a notable sense of accomplishment when you move.";

    if(this.myInternalState.publicEventCount!>=10)
      userMessage.content += `\nPublic presentations have increased; total reports: ${this.myInternalState.reportsGenerated}.`;

    if(this.myInternalState.commitmentDate!==null)
      userMessage.content += `\nBeen in your current role commitment for ${curStage} stage messages.`;

    // Return the updated state
    return { messageState: this.myInternalState };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    // Logic to run after the main AI responds (if needed)
    return { messageState: this.myInternalState };
  }

  // The render method is required but often empty for backend-focused stages
  render(): ReactElement {
    return <div></div>;
  }
}

