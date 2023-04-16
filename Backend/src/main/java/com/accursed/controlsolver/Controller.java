package com.accursed.controlsolver;

import com.accursed.controlsolver.routhCriteria.RouthDTO;
import com.accursed.controlsolver.routhCriteria.RouthSolver;
import com.accursed.controlsolver.signalFlow.SignalFlowDTO;
import com.accursed.controlsolver.signalFlow.SignalFlowGraph;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
        return signalFlowDTO;
    }
}
