package com.accursed.controlsolver.signalFlow;

import java.util.*;
import java.util.List;

public class SignalFlowGraph
{
    int size;
    private List<pair>[] roads;
    public List<List<Integer>> loops;
    private List<Double> loopsWeights;
    private boolean[][] loopsMatrix;
    private Double[] loopMasks;
    public List<List<String>> nonIntersectingLoopsEveryPath;
    public List<String> paths;
    public List<Double> deltasForEachPath;
    public List<String> loopsForDeltaTotal;

    public SignalFlowGraph(double[][] graph){
        this.size = graph.length;
        roads = new ArrayList[size];
        for (int i = 0; i < size; i++) roads[i] = new ArrayList<>();
        loops = new ArrayList();
        loopsWeights = new ArrayList<>();
        nonIntersectingLoopsEveryPath = new ArrayList<>();
        paths = new ArrayList<>();
        loopsForDeltaTotal = new ArrayList<>();
        deltasForEachPath = new ArrayList<>();

        for (int i = 0; i < size; i++)
            for (int j = 0; j < size; j++)
                if(graph[i][j] != 0)
                    roads[i].add(new pair(j, graph[i][j]));
        getAllLoops();
    }
//    public SignalFlowGraph(List<Point> pairs, List<Double> weights, int s)
//    {
//        this.size = s;
//
//        for (int i = 0; i < pairs.size(); i++)
//        {
//            int x = pairs.get(i).x;
//            int y = pairs.get(i).y;
//            double weight = weights.get(i);
//            roads[x].add(new pair(y, weight));
//        }
//        this.getAllLoops();
//    }

    private void getAllLoops()
    {
        List<Integer> emptyList = new ArrayList<>();

        for (int i = 0; i < size; i++)
            dfsLoop(i, 1, emptyList);

        getDoubleIntersectingMatrices();
        getDP();
    }
    private void dfsLoop(int x, double gain, List<Integer> stack)
    {
        if (stack.size() > 0 && stack.get(0) == x)
        {
            List<Integer> temp = List.copyOf(stack);
            if (!checkLoopNotCountedBefore(stack))
            {
                loops.add(temp);
                loopsWeights.add(gain);
            }
            return;
        }

        for (int i = 1; i < stack.size(); i++)
            if (stack.get(i) == x) return;

        stack.add(x);

        for (pair p : roads[x])
            dfsLoop(p.first, gain * p.second, stack);

        stack.remove(stack.size() - 1);
    }
    boolean checkLoopNotCountedBefore(List<Integer> stack)
    {
        for (int i = 0; i < loops.size(); i++)
            if (checkTwoLoopsSame(stack, i))
                return true;
        return false;
    }
    boolean checkTwoLoopsSame(List<Integer> stack, int index)
    {
        List<Integer> list1 = new ArrayList<>(stack);
        List<Integer> list2 = new ArrayList<>(loops.get(index));

        Collections.sort(list1);
        Collections.sort(list2);
        if (list1.size() != list2.size()) return false;
        for (int i = 0; i < list1.size(); i++)
            if (list1.get(i) != list2.get(i))
                return false;
        return true;
    }

    private void getDoubleIntersectingMatrices()
    {
        loopsMatrix = new boolean[loops.size()][loops.size()];
        for (int i = 0; i < loops.size(); i++)
        {
            HashSet<Integer> sett = new HashSet<>();
            for (Integer element : loops.get(i))
                sett.add(element);
            for (int j = 0; j < loops.size(); j++)
            {
                boolean flag = true;
                if (i == j)
                {
                    this.loopsMatrix[i][i] = true;
                    continue;
                }
                for (Integer element : loops.get(j))
                    if (sett.contains(element))
                        flag = false;
                loopsMatrix[i][j] = flag;
            }
        }
    }

    private void getDP()
    {
        this.loopMasks = new Double[(1 << loops.size())];
        Arrays.fill(this.loopMasks, (double)0);
        loopMasks[0] = (double)1;

        for (int ii = 1; ii < (1 << loops.size()); ii++)
        {
            List<Integer> takenLoops = new ArrayList<>();
            for (int i = 0; i < loops.size(); i++)
            {
                int bit = (1 << i);
                if ((ii & bit) == 0) continue;
                takenLoops.add(i);
            }
            int lastone = takenLoops.get(takenLoops.size() - 1);
            boolean flag = true;
            for (int i : takenLoops)
                if (loopsMatrix[i][lastone] == false)
                    flag = false;
            if (!flag) continue;
            this.loopMasks[ii] = this.loopMasks[ii - (1 << lastone)] * this.loopsWeights.get(lastone);
        }
    }

    public double calculateGraph()
    {
        List<Integer> stack = new ArrayList<>();
        List<Boolean> taken = new ArrayList<>();

        for (double i = 0; i < size; i++)
            taken.add(false);
        double ans = this.dfsPath(0, 1, stack, taken) / this.calculateDeltaTotal();
        int lastElementIndex = nonIntersectingLoopsEveryPath.size()-1;
        this.loopsForDeltaTotal = this.nonIntersectingLoopsEveryPath.get(lastElementIndex);
        this.nonIntersectingLoopsEveryPath.remove(lastElementIndex);
        return ans;
    }
    double dfsPath(Integer x, double gain, List<Integer> stack, List<Boolean> taken)
    {
        stack.add(x);
        taken.set(x, true);
        if (x == size - 1)
        {
            paths.add(getPathsString(stack));
            return gain * calculateDeltaForPath(stack);
        }

        double ans = 0;

        for (pair p : roads[x])
        {
            if (taken.get(p.first)) continue;
            ans += dfsPath(p.first, gain * p.second, stack, taken);

            stack.remove(stack.size() - 1);
            taken.set(p.first, false);
        }
        return ans;
    }
    double calculateDeltaForPath(List<Integer> stack)
    {
        boolean[] validLoops = getAllValidLoopsForPaths(stack);
        double ans = calculateDelta(validLoops);
        deltasForEachPath.add(ans);
        return ans;
    }
    double calculateDeltaTotal()
    {
        boolean[] validTemp = new boolean[loops.size()];
        Arrays.fill(validTemp, true);
        return calculateDelta(validTemp);
    }
    double calculateDelta(boolean[] validLoops)
    {
        double ans = 1;
        List<String> currentLoops = new ArrayList<>();
        for (int mask = 1; mask < (1 << loops.size()); mask++)
        {
            boolean flag = true;
            double count = 0;
            for (int i = 0; i < loops.size(); i++)
            {
                int bit = (1 << i);
                if ((mask & bit) == 0) continue;
                if (validLoops[i] == false) flag = false;
                count++;
            }
            if (!flag) continue;

            currentLoops.add((getNonIntersectingLoops(mask) + ", " + this.loopMasks[mask]));
            if (count % 2 == 0)
                ans += this.loopMasks[mask];
            else
                ans -= this.loopMasks[mask];
        }
        nonIntersectingLoopsEveryPath.add(currentLoops);
        return ans;
    }
    boolean[] getAllValidLoopsForPaths(List<Integer> stack)
    {
        boolean validLoops[] = new boolean[loops.size()];
        for (int i = 0; i < loops.size(); i++)
            validLoops[i] = checkLoopForPath(stack, i);
        return validLoops;
    }
    boolean checkLoopForPath(List<Integer> stack, int loopIndex)
    {
        HashSet<Integer> sett = new HashSet<>();
        for (int i : stack)
            sett.add(i);
        for (Integer i : loops.get(loopIndex))
            if (sett.contains(i) == true)
                return false;
        return true;
    }
    private String getNonIntersectingLoops(int mask)
    {
        String ans = "";
        for (int i = 0; i < loops.size(); i++) {
            int bit = 1<<i;
            if((bit & mask) != 0)
                ans = ans.concat("L" + i +" ");
        }
        return ans;
    }
    private String getPathsString(List<Integer> stack)
    {
        String ans = "";
        for(int i : stack)
            ans = ans.concat("d" + i + " ");
        return ans;
    }
    private class pair
    {
        int first;
        double second;

        public pair(int f, double s)
        {
            this.first = f;
            this.second = s;
        }
    }
}
