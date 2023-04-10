import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as joint from "jointjs";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit{
  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: document.getElementById('workspace')!,
      model: this.graph,
      width: '100%',
      height: '100%',
      gridSize: 1,
      drawGrid: true,
      background: {
        color: 'rgba(0, 255, 0, 0.3)'
      },

      defaultLink: () => new joint.shapes.standard.Link(),
      linkPinning: false,

      validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        // Prevent linking from input ports
        if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
        // Prevent linking from output ports to input ports within one element
        if (cellViewS === cellViewT) return false;
        // Prevent linking to output ports
        return magnetT && magnetT.getAttribute('port-group') === 'in';
      },
      validateMagnet: function(cellView, magnet) {
        // Note that this is the default behaviour. It is shown for reference purposes.
        // Disable linking interaction for magnets marked as passive
        return magnet.getAttribute('magnet') !== 'passive';
      },

      // Enable mark available for cells & magnets
      markAvailable: true,
    });

    const r1 = this.createBlock('K(S + 20) / (S^2 + 5S + 20)');
    const r2 = this.createBlock('K / S (S + 20) (S^2 + 5S + 20)');
    r2.translate(30, 30);
    const link = this.createLink(r1, r2);


    this.paper.on('element:mouseenter', function(elementView) {
      elementView.showTools();
    });

    this.paper.on('element:mouseleave', function(elementView) {
      elementView.hideTools();
    });

    this.paper.on('link:mouseenter', function(elementView) {
      elementView.showTools();
    });

    this.paper.on('link:mouseleave', function(elementView) {
      elementView.hideTools();
    });

  }

  createBlock(text: any){
    const Inport = this.createPort('In', 'left');
    const Outport = this.createPort('In', 'right');
    const rect = new joint.shapes.standard.Rectangle({
      position:{
        x: 100,
        y: 100,
      },
      size:{
        width: 200,
        height: 50,
      },
      attrs: {
        body: {
          rx: 10,
          ry: 10,
          fill: 'lightblue',
          stroke: '#333',
        },
        label: {
          text: text,
          fill: 'black',
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
        attrs: { label: { text: 'in' }}
      },
      {
        group: 'out',
        attrs: { label: { text: 'out' }}
      }
    ]);

    this.graph.addCell(rect);
    const e1 = rect.findView(this.paper);
    const t1 = this.createToolsView();
    e1.addTools(t1);
    e1.hideTools();

    return rect;
  }

  createToolsView(){
    const boundaryTool = new joint.elementTools.Boundary({
      padding: 20,
      rotate: true,
      useModelGeometry: true,
    });

    const removeButton = new joint.elementTools.Remove();
    const toolsview = new joint.dia.ToolsView({
      tools: [
        boundaryTool,
        removeButton
      ]
    });
    return toolsview
  }

  createLink(block1 : any, block2 : any){
    const link = new joint.shapes.standard.Link({
      label:{
        text: 'G(S)',
        fill: '#333',
        stroke: '#FFF'
      },
    });

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

    link.source(block1);
    link.target(block2);

    link.addTo(this.graph);

    const elementView = link.findView(this.paper);
    elementView.addTools(toolsView);
    elementView.hideTools();

    return link
  }

  createPort(text: any, pos: any){
    const port = {
      id: 'custom-port-id', // set a custom ID
      position:{
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
          r: 13,
          x: -8,
          y: -8,
          fill:  '#133056',
          stroke: '#e1c019',
          strokeWidth: 3,
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
    return port;
  }
}