export class SignalFlowDTO {
  public graph!: number[][];
  public transferFunction!: number;
  public paths!: string[];
  public loops!: string[];
  public nonIntersectingLoopsEveryPath!:string[][];
  public deltasForEachPath!: number[];
}
