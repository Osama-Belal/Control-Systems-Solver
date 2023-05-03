package com.accursed.controlsolver;

import com.accursed.controlsolver.routhCriteria.RouthDTO;
import com.accursed.controlsolver.routhCriteria.RouthSolver;
import com.accursed.controlsolver.signalFlow.SignalFlowDTO;
import com.accursed.controlsolver.signalFlow.SignalFlowGraph;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class Controller {
    @PostMapping("/routh")
    public RouthDTO routh(@RequestBody RouthDTO routhDTO){
        RouthSolver routhSolver = new RouthSolver(routhDTO.routhCoefficients);
        return routhSolver.solve();
    }
    @PostMapping("/graph")
    public SignalFlowDTO signalFlow(@RequestBody SignalFlowDTO signalFlowDTO){
        SignalFlowGraph signalFlowGraph = new SignalFlowGraph(signalFlowDTO.graph);
        signalFlowDTO.transferFunction = signalFlowGraph.calculateGraph();
        signalFlowDTO.paths = signalFlowGraph.paths;
        signalFlowDTO.nonIntersectingLoopsEveryPath = signalFlowGraph.nonIntersectingLoopsEveryPath;
        signalFlowDTO.deltasForEachPath = signalFlowGraph.deltasForEachPath;
        signalFlowDTO.loops = new ArrayList<>();
        for(List<Integer> i : signalFlowGraph.loops){
            String temp = "";
            for(Integer j : i){
                temp = temp.concat(j + " ");
            }
            signalFlowDTO.loops.add(temp);
        }
        return signalFlowDTO;
    }
}
