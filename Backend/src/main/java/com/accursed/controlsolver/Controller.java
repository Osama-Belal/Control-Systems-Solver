package com.accursed.controlsolver;

import com.accursed.controlsolver.routhCriteria.RouthDTO;
import com.accursed.controlsolver.routhCriteria.RouthSolver;
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
}
