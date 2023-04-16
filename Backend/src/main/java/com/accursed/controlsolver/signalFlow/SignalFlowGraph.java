package com.accursed.controlsolver.signalFlow;
import java.awt.*;
import java.util.*;
import java.util.List;

public class SignalFlowGraph
{
    int size;
    private List<pair> roads[];
    private List<List<Integer>> loops;
    private List<Double> loopsWeights;
    private boolean loopsMatrix[][];
    private Double loopMasks[];
    public SignalFlowGraph(List<Point> pairs, List<Double> weights, int s)
    {
        this.size = s;
        roads = new ArrayList[size];
        for (int i = 0; i < size; i++) roads[i] = new ArrayList<>();
        loops = new ArrayList();
        loopsWeights = new ArrayList<>();

        for (int i = 0; i < pairs.size(); i++)
        {
            int x = pairs.get(i).x;
            int y = pairs.get(i).y;
            double weight = weights.get(i);
            roads[x].add(new pair(y, weight));
        }
        this.getAllLoops();
    }

    private void getAllLoops()
    {
        List<Integer> emptyList = new ArrayList<>();

        for (int i = 0; i < size; i++)
            dfs1(i, 1, emptyList);

        getDoubleIntersectingMatrices();
        getDP();
    }
    private void dfs1(int x, double gain, List<Integer> stack)
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
            dfs1(p.first, gain * p.second, stack);

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
            this.loopMasks[ii] = this.loopMasks[ii - (1 << lastone)] + this.loopsWeights.get(lastone);
        }
    }

    public double calculateGraph()
    {
        List<Integer> stack = new ArrayList<>();
        List<Boolean> taken = new ArrayList<>();

        for (double i = 0; i < size; i++)
            taken.add(false);
        double ans = this.dfs2(0, 1, stack, taken) / this.calculateDeltaTotal();
        return ans;
    }
    double dfs2(Integer x, double gain, List<Integer> stack, List<Boolean> taken)
    {
        stack.add(x);
        taken.set(x, true);
        if (x == size - 1)
            return gain * calculateDeltaForPath(stack);

        double ans = 0;

        for (pair p : roads[x])
        {
            if (taken.get(p.first)) continue;
            ans += dfs2(p.first, gain * p.second, stack, taken);

            stack.remove(stack.size() - 1);
            taken.set(p.first, false);
        }
        return ans;
    }
    double calculateDeltaForPath(List<Integer> stack)
    {
        boolean validLoops[] = getAllValidLoopsForPaths(stack);
        return calculateDelta(validLoops);
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
        for (int ii = 0; ii < (1 << loops.size()); ii++)
        {
            boolean flag = true;
            double count = 0;
            for (int i = 0; i < loops.size(); i++)
            {
                int bit = (1 << i);
                if ((ii & bit) == 0) continue;
                if (validLoops[i] == false) flag = false;
                count++;
            }
            if (!flag) continue;
            if (count % 2 == 0)
                ans += this.loopMasks[ii];
            else
                ans -= this.loopMasks[ii];
        }
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
