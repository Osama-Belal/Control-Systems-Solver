import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        RouthSolver routhSolver = new RouthSolver(Arrays.asList(-1.0,-1.0,-1.0,-1.0,-1.0));
//        routhSolver.setEquation();
        System.out.println(routhSolver.isStable());
    }
}

