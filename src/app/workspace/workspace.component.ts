import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as joint from "jointjs";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: document.getElementById('workspace')!,
      model: this.graph,
      interactive: {
        labelMove: true,
     },
      width: '100%',
      height: '100%',
      gridSize: 1,
      drawGrid: true,
      background: {
        color: 'rgba(0, 25, 0, 0.3)'
      },

      defaultLink: () => this.createLink(),

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

    const r1 = this.createBlock('K(S + 20) / (S^2 + 5S + 20)');
    const r2 = this.createBlock('K / S (S + 20) (S^2 + 5S + 20)');
    r2.translate(30, 30);


    //toolbox behaviour
    this.paper.on('element:mouseenter', function (elementView) {
      elementView.showTools();
    });

    //temporarily disable hide and make the event of show as right click on element 
    //it didn't work with previous code mouseenter and mouseleave

    this.paper.on('element:mouseleave', function(elementView) {
      elementView.hideTools();
    });

    this.paper.on('link:mouseenter', function (elementView) {
      elementView.showTools();
    });

    this.paper.on('link:mouseleave', function (elementView) {
      elementView.hideTools();
    });

  }

  createBlock(text: any) {
    const Inport = this.createPort('In', 'left');
    const Outport = this.createPort('In', 'right');
    const rect = new joint.shapes.standard.Rectangle({
      position: {
        x: 100,
        y: 100,
      },
      size: {
        width: 220,
        height: 50,
      },
      attrs: {
        body: {
          rx: 10,
          ry: 10,
          fill: 'lightblue',
          stroke: '#133056',
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
      padding: 20,
      rotate: true,
      useModelGeometry: true,
      
    });

    const removeButton = new joint.elementTools.Remove();

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

  createLink() {
  
    const link = new joint.shapes.standard.Link
    link.appendLabel({
      markup: [
        {
            tagName: 'circle',
            selector: 'body'
        }, 
        {
            tagName: 'text',
            selector: 'label'
        }
      ],
      attrs: {
        label: {
            text: "input",
            fill: '#000000',
            fontSize: 14,
            textAnchor: 'middle',
            yAlignment: 'middle',
            pointerEvents: 'none',
        },
        body: {
            ref: 'label',
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 1,
            r: 'calc(s)',
            cx: 0,
            cy: 0
        },
        
      }
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
          r: 13,
          x: -8,
          y: -8,
          fill: '#133056',
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
