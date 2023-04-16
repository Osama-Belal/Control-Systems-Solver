package com.accursed.controlsolver.routhCriteria;

import lombok.Setter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Setter
public class RouthSolver {
    private double[][] routhTable;
    private int rowSize;
    private int maxPower;
    private static final double eps = 1e-10;

    public RouthSolver(List<Double> equation) {
        setEquation(equation);
    }

    private void setEquation(List<Double> equation){
        maxPower = equation.size();
        rowSize = (int)Math.ceil(equation.size()/2.0);
        routhTable = new double[maxPower][rowSize];
        for(int i=0;i<equation.size();i++){
            if(i%2==0) routhTable[0][i/2] = equation.get(i);
            else routhTable[1][i/2] = equation.get(i);
        }
    }
    private List<Double> solve(){
        for(int i=2;i<maxPower;i++){
            double val1 = routhTable[i-1][0];
            double val2 = routhTable[i-2][0];
            if(val1==0){
                val1 = eps;
                routhTable[i-1][0]=eps;
            }
            for(int j=0;j<rowSize-1;j++){
                routhTable[i][j] = ((val1*routhTable[i-2][j+1]-val2*routhTable[i-1][j+1])/val1);
            }
            zeroRow(i);
        }
        List<Double> out = new ArrayList<>(Collections.nCopies(maxPower, 0.0));
        for(int i=0;i<maxPower;i++){
            out.set(i,routhTable[i][0]);
        }
        System.out.println(out);
        return out;
    }
    public boolean isStable(){
        List<Double> routhOut = solve();
        boolean stable = true;
        int rootCount = 0;
        for(int i = 0;i<routhOut.size()-1;i++){
            if(routhOut.get(i)* routhOut.get(i+1)<0) {
                stable = false;
                rootCount++;
            }
        }
        System.out.println(rootCount);
        return stable;
    }
    private void zeroRow(int row){
        int sum = 0;
        int pow = maxPower - row;
        for(int i=0;i<rowSize;i++)sum+=routhTable[row][i];
        if(sum==0){
            for(int i = 0;i<rowSize;i++){
                routhTable[row][i] = routhTable[row-1][i]*pow;
                pow-=2;
            }
        }
    }
}
