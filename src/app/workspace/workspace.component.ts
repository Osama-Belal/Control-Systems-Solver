import {Component, OnInit} from '@angular/core';
import * as joint from "jointjs";
import {SignalGraphService} from "../Service/signal-graph.service";
import {SignalFlowDTO} from "./SignalFlowDTO";


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  GraphDTO!: any;
  isHidden: boolean = true;
  currentPath: string = ""
  currentShow: string = ""
  constructor(public SignalService: SignalGraphService) { }

  ngOnInit(): void {

    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: document.getElementById('workspace')!,
      model: this.graph,
      interactive: {
        linkMove: true,
        labelMove: true,
        vertexRemove: true,
        useLinkTools: true
      },
      width: '100%',
      height: '100%',
      gridSize: 1,
      drawGrid: true,
      background: {
        color: '#ffffff'
      },

      defaultLink: () => this.createLink("20"),
      linkPinning: false,

      validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        // Prevent linking from input ports
        if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
        // Prevent linking from output ports to input ports within one element
        // if (cellViewS === cellViewT) return false;
        // Prevent linking to output ports
        return magnetT && magnetT.getAttribute('port-group') === 'in';
      },

      validateMagnet: function (cellView, magnet) {
        // Note that this is the default behaviour. It is shown for reference purposes.
        // Disable linking interaction for magnets marked as passive
        return magnet.getAttribute('magnet') !== 'passive';
      },

      // Enable mark available for cells & magnets
      markAvailable: true,
    });

    //toolbox behaviour
    this.paper.on('cell:mouseenter', function (elementView) {
      elementView.showTools();
    });

    this.paper.on('cell:mouseleave', function (elementView) {
      elementView.hideTools();
    });

    //edit link and node labels when clicked on
    this.paper.on('cell:pointerdblclick', (elementView, e) => {
      const cell = elementView.model;

      if (cell instanceof joint.shapes.standard.Link) {
        cell.prop('labels/0/attrs/text/text', prompt("Enter link " +
          "label, \nNumbers only", cell.prop('labels/0/attrs/text/text')));
      }
      else if (cell instanceof joint.shapes.standard.Rectangle) {
        cell.prop('attrs/label/text', prompt("Enter node name\nNote that you can name nodes whatever " +
          "you want for visualizing the graph,\nHowever, when you submit the graph, all nodes must be labeled" +
          " as numbers starting from 0, and ending at the largest node value, " +
          "otherwise your graph won't be calculated", cell.prop('attrs/label/text')));
      }
    });

    // static on initialization graph
    const node_1 = this.createNode('0');
    const node_2 = this.createNode('1');
    const node_3 = this.createNode('2');

    const link1 = this.createLink('20')
    const link2 = this.createLink('20')
    const link3 = this.createLink('20')
    const link4 = this.createLink('20')
    const link5 = this.createLink('20')
    link1.source(node_1)
    link1.target(node_2)
    link2.source(node_1)
    link2.target(node_2)
    link3.source(node_1)
    link3.target(node_2)
    link4.source(node_2)
    link4.target(node_3)
    link5.source(node_2)
    link5.target(node_3)
  }

  createNode(label: any) {
    const Inport = this.createPort('In', 'left');
    const Outport = this.createPort('In', 'right');
    const rect = new joint.shapes.standard.Rectangle({
      position: {
        x: Math.random() * window.innerWidth / 2,
        y: Math.random() * window.innerHeight / 2,
      },
      size: {
        width: 50,
        height: 50,
      },
      attrs: {
        body: {
          rx: 100,
          ry: 100,
          fill: '#97DEFF',
          stroke: '#133056',
        },
        label: {
          text: label,
          fill: '#333',
          fontSize: 14,
          fontFamily: 'sans-serif',
        }
      },
      ports: {
        groups: {
          'in': Inport,
          'out': Outport
        }
      }
    });

    rect.addPorts([
      {
        group: 'in',
        attrs: { label: { text: '' } }
      },
      {
        group: 'out',
        attrs: { label: { text: '' } }
      }
    ]);

    this.graph.addCell(rect);
    const e1 = rect.findView(this.paper);
    const t1 = this.createToolsView();
    e1.addTools(t1);
    e1.hideTools();

    return rect;
  }

  createToolsView() {
    const boundaryTool = new joint.elementTools.Boundary({
      padding: 10,
      rotate: true,
      useModelGeometry: true,
    });

    const removeButton = new joint.elementTools.Remove({ x: '50%' });
    return new joint.dia.ToolsView({
      tools: [
        boundaryTool,
        removeButton,
      ]
    })
  }

  createLink(text: any) {

    const link = new joint.shapes.standard.Link({
      attrs: {
        line: {
          stroke: '#133056',
          strokeWidth: 2,
        }
      }
    });

    link.appendLabel({
      markup: [
        {
          tagName: 'circle',
          selector: 'body'
        },
        {
          tagName: 'text',
          selector: 'label'
        },
      ],
      attrs: {
        text: {
          text: text,
          fill: '#642727',
          fontSize: 14,
          textAnchor: 'middle',
          yAlignment: 'middle',
        },
        body: {
          fill: '#ff8989',
          stroke: '#133056',
          strokeWidth: 2,
          //make the radius dynamic
          r: 21,
          refWidth: '120%',
          refHeight: '120%',
        }
      }
    });
    link.connector('curve')
    console.log(link)

    const verticesTool = new joint.linkTools.Vertices();
    const segmentsTool = new joint.linkTools.Segments();
    // const sourceArrowheadTool = new joint.linkTools.SourceArrowhead();
    const targetArrowheadTool = new joint.linkTools.TargetArrowhead();
    const boundaryTool = new joint.linkTools.Boundary();
    const removeButton = new joint.linkTools.Remove();
    const toolsView = new joint.dia.ToolsView({
      tools: [
        verticesTool, segmentsTool,
        // sourceArrowheadTool,
        targetArrowheadTool,
        boundaryTool, removeButton
      ]
    });

    link.addTo(this.graph);

    const elementView = link.findView(this.paper);
    elementView.addTools(toolsView);
    elementView.hideTools();

    return link
  }

  createPort(text: any, pos: any) {
    return {
      id: 'custom-port-id', // set a custom ID
      position: {
        name: pos
      },
      label: {
        markup: [{
          tagName: 'text',
          selector: 'label'
        }],
        position: {
          name: pos
        }
      },
      attrs: {
        portBody: {
          magnet: true,
          r: 8,
          x: -8,
          y: -8,
          fill: '#133056',
          stroke: '#e1c019',
          strokeWidth: 2,
        },
        label: {
          text: text,
        }
      },
      markup: [{
        tagName: 'circle',
        selector: 'portBody'
      }]
    };
  }

  clearGraph() {
    this.graph.clear();
  }


  createAdjacencyMatrix() {
    //number of nodes
    let n = this.graph.getElements().length;
    let weightedGraph: any[][] = [];

    //just initialize the adjacency matrix
    for (let i = 0; i < n; i++) {
      weightedGraph[i] = [];
      for (let j = 0; j < n; j++) {
        weightedGraph[i][j] = 0;
      }
    }

    this.graph.getLinks().forEach((link) => {
      let sourceLabel = link.getSourceElement()?.prop('attrs/label/text');
      let targetLabel = link.getTargetElement()?.prop('attrs/label/text');
      //push the link label at the index of the source and target
      console.log(sourceLabel, targetLabel);
      console.log(link.prop('labels/0/attrs/text/text'));
      weightedGraph[sourceLabel][targetLabel] = link.prop('labels/0/attrs/text/text');

    });

    //print the adjacency matrix in formatted way
    let output = '[';
    for (let i = 0; i < weightedGraph.length; i++) {
      output += '[' + weightedGraph[i].join(',') + ']';
      if (i < weightedGraph.length - 1) {
        output += '\n ';
      }
    }
    output += ']';
    console.log(output);
    console.log(weightedGraph);
    this.isHidden = false;

    this.GraphDTO = new SignalFlowDTO()
    this.GraphDTO.graph = weightedGraph
    this.SignalService.sendToBackend(this.GraphDTO).subscribe((data) => {
      this.GraphDTO = data
      this.drawPaths()
    });
  }

  zoom(type: any){
    type == '+' ? this.paper.scale(this.paper.scale().sx + 0.1, this.paper.scale().sy + 0.1):
                  this.paper.scale(this.paper.scale().sx - 0.1, this.paper.scale().sy - 0.1);
  }

  async drawPaths() {
    console.log(this.GraphDTO)


    this.currentShow = "Forward Paths"
    console.log(this.GraphDTO.paths)
    for (let i = 0; i < this.GraphDTO.paths.length; i++) {
      let links = []
      this.currentPath = this.GraphDTO.paths[i] + ", Δᵢ = " + this.GraphDTO.deltasForEachPath[i]
      // this.currentPath = "Δᵢ = " + this.GraphDTO.deltasForEachPath[i]
      let nonIntersectingLoopsEveryPath = ""

      this.GraphDTO.nonIntersectingLoopsEveryPath[i].forEach((loop: any) => {
        nonIntersectingLoopsEveryPath += '(' + loop + ')'
      })
      console.log(nonIntersectingLoopsEveryPath)
      if(nonIntersectingLoopsEveryPath.length > 0){
        this.currentPath += "\nNon-touching loops = " + nonIntersectingLoopsEveryPath
      }
      
      const split_path = this.GraphDTO.paths[i].split(" ")

      for (let j = 0; j < split_path.length - 1; j++) {
        const src = split_path[j], target = split_path[j + 1]
        for (const link of this.graph.getLinks()) {
          let sourceLabel = link.getSourceElement()?.prop('attrs/label/text');
          let targetLabel = link.getTargetElement()?.prop('attrs/label/text');
          if (sourceLabel === src && targetLabel === target)
            links.push(link)
        }
      }
      
      await recolorLinks(links, 'red', nonIntersectingLoopsEveryPath.length > 0)
    }

    this.currentShow = "Loops in graph"
    console.log(this.GraphDTO.loops)
    for(let i = 0;i < this.GraphDTO.loops.length;i++){
      let links = []
      const split_loops = this.GraphDTO.loops[i].split(" ")
      split_loops[split_loops.length - 1] = split_loops[0]
      console.log(split_loops)
      this.currentPath = this.GraphDTO.loops[i] + ' ' + split_loops[0]

      for(let j = 0;j < split_loops.length - 1;j++){
        const src = split_loops[j], target = split_loops[j+1]
        for (const link of this.graph.getLinks()) {
          let sourceLabel = link.getSourceElement()?.prop('attrs/label/text');
          let targetLabel = link.getTargetElement()?.prop('attrs/label/text');
          if (sourceLabel === src && targetLabel === target)
            links.push(link)
        }
      }
      await recolorLinks(links, 'orange')
    }

    // TODO print every n non-touching loops

    this.currentShow = "Result Transfer function"
    this.currentPath = this.GraphDTO.transferFunction

    setTimeout(() => {this.isHidden = true}, 2000)

  }
}

function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function recolorLinks(links: any[], color: any, nonIntersectingCheck: boolean = false) {
  for (let i = 0; i < links.length; i++) {
    const originalColor = links[i].attr('line/stroke');
    links[i].attr({'line': {stroke: color, strokeWidth: 4}})
    if(nonIntersectingCheck){
      await sleep(3000);  
    }else{
      await sleep(1000);  
    }
    // setInterval(() => {links[i].attr({'line': { stroke: originalColor, strokeWidth: 2 }});}, 1000);
    links[i].attr({'line': { stroke: originalColor, strokeWidth: 2 }})
  }
}
