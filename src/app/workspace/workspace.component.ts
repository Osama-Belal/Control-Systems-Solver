import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import * as joint from "jointjs";
import {toNumbers} from "@angular/compiler-cli/src/version_helpers";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  constructor(private renderer: Renderer2) {}

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

      defaultLink: () => this.createLink("G(S)"),
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

    this.paper.on('cell:mouseleave', function(elementView) {
      elementView.hideTools();
    });

    //edit link and node labels when clicked on
    this.paper.on('cell:pointerdblclick', (elementView, e) =>{
        const cell = elementView.model;

        // const textarea = document.getElementById("text")!;
        // this.renderer.setStyle(textarea, 'top', e.clientY+'px')
        // this.renderer.setStyle(textarea, 'left', e.clientX+'px')
        // textarea.style.display = 'block'
        // textarea.textContent = 'labels/0/attrs/text/text';
        // console.log(textarea.textContent)

        if (cell instanceof joint.shapes.standard.Link) {
          cell.prop('labels/0/attrs/text/text', prompt("Enter link label", cell.prop('labels/0/attrs/text/text')));
        }
        else if (cell instanceof joint.shapes.standard.Rectangle) {
          cell.prop('attrs/label/text',  prompt("Enter node label", cell.prop('attrs/label/text')));
        }
    });

    // static on initialization graph
    const node_1 = this.createNode('R(S)');
    const node_2 = this.createNode('C(S)');
    const link = this.createLink('G(S)')
    link.source(node_1)
    link.target(node_2)
  }

  createNode(label:any) {
    const Inport = this.createPort('In', 'left');
    const Outport = this.createPort('In', 'right');
    const rect = new joint.shapes.standard.Rectangle({
      position: {
        x: Math.random() * window.innerWidth / 2,
        y: Math.random() * window.innerHeight / 2,
      },
      size: {
        width: 60,
        height: 60,
      },
      attrs: {
        body: {
          rx: 100,
          ry: 100,
          fill: '#97DEFF',
          stroke: '#133056',
        },
        label:{
          text: label,
          fill: '#133056',
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

    const removeButton = new joint.elementTools.Remove({x: '50%'});

    // var infoButton = new joint.elementTools.Button({
    //   focusOpacity: 0.5,
    //   // top-right corner
    //   x: '100%',
    //   y: '0%',
    //   offset: { x: -5, y: -5 },
    //   action: function(evt) {
    //       alert('View id: ' + this.id + '\n' + 'Model id: ' );
    //   },
    //   markup: [{
    //       tagName: 'circle',
    //       selector: 'button',
    //       attributes: {
    //           'r': 7,
    //           'fill': '#001DFF',
    //           'cursor': 'pointer'
    //       }
    //   }, {
    //       tagName: 'path',
    //       selector: 'icon',
    //       attributes: {
    //           'd': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
    //           'fill': 'none',
    //           'stroke': '#FFFFFF',
    //           'stroke-width': 2,
    //           'pointer-events': 'none'
    //       }
    //   }]
    // });


    const toolsview = new joint.dia.ToolsView({
      tools: [
        boundaryTool,
        removeButton,
        // infoButton
      ]
    });
    return toolsview
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
            // ref: 'label',
            fill: '#ff8989',
            stroke: '#133056',
            strokeWidth: 2,
            r: 21,
            refWidth: '120%',
            refHeight: '120%',
        }
      }
    });
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
    const port = {
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
    return port;
  }

  clearGraph(){
    this.graph.clear();
  }
}
