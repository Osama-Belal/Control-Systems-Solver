package com.accursed.controlsolver.signalFlow;

import java.util.List;

public class SignalFlowDTO {
    public double[][] graph;
    public double transferFunction;
    public List<String> paths;
    public List<String> loops;
    public List<List<String>> nonIntersectingLoopsEveryPath;
    public List<Double> deltasForEachPath;
}
