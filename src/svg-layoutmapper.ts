// @ts-ignore
import { DriveType, SlotOrientation } from "./harddrive.ts";
// @ts-ignore
import { Server, BoxType } from "./server.ts";
// @ts-ignore
import { svgtojson } from "./svgtojson.ts";
import { SVG } from "@svgdotjs/svg.js";

declare global {
    interface Window {
        clear:any;
        draw:any;
        drawDriveLayout:any;
        downloadString:any;
        showjson:any;
        showShape:any;
        diaShapeDraw:any;
        diaShapeHeader:any;
        server_obj:any;
        updateSerialNumber:any;
    }
}

let ssd_type = [
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25,
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25,
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25,
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25
];

let draw = SVG().addTo("#box");
let diaShapeHeader = "";
var server_obj = new Server( "Example", BoxType.Rackmount, 24, 1, 24, ssd_type, SlotOrientation.Vertical, 2);


window.clear = clear;
window.downloadString = downloadString;
window.drawDriveLayout = drawDriveLayout;
window.draw = draw;
window.showjson = showjson;
window.showShape= showShape;
window.diaShapeDraw= diaShapeDraw;
window.diaShapeHeader = diaShapeHeader;
window.server_obj = server_obj;
window.updateSerialNumber = updateSerialNumber;

function clear(thedraw:any){
    thedraw.clear();
}

function downloadString(text:string, fileType:string, fileName:string) {
    var blob = new Blob([text], { type: fileType  });
    var a = document.createElement("a");
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(":");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href);  }, 1500);
}

/*
let hdd_type = [
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35,
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35,
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35,
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35
];
*/

//let server = new Server( "Example", BoxType.Rackmount, 24, 1, 24, ssd_type, SlotOrientation.Vertical, 2);
// let server = new Server( "Node2", BoxType.Rackmount, 24, 6, 4, hdd_type, SlotOrientation.Horizontal, 6);
// let server = new Server( "Node3", BoxType.Rackmount, 16, 16, 1, ssd_type, SlotOrientation.Horizontal, 7);
// let server = new Server( "Node4", BoxType.Rackmount, 24, 3, 4, hdd_type, SlotOrientation.Horizontal, 2 );
// let server = new Server( "Node5", BoxType.Rackmount, 16, 1, 4, hdd_type, SlotOrientation.Horizontal, 1);
// let server = new Server( "Node6", BoxType.Tower, 16, 4, 4, hdd_type, SlotOrientation.Vertical, 3);
draw.add( server_obj.getSVG().move(5,5) );
draw.size( server_obj.width+((server_obj.hd_z+1)*10)+10, (server_obj.height*(1+server_obj.hd_z))+10);
//console.log( "Width = " + (server.width+(server.hd_z*6) +10) + " Height =" + ( server.height*(server.hd_z+2)+10));
//console.log( "Z level = " +server.hd_z  );


function drawDriveLayout( svg: any, server_name: string, server_type: BoxType, 
    drive_slot: number, drive_row: number, drive_col: number, drives_type: DriveType[],
    slot_type: SlotOrientation, server_unit?: number, customx?: number, customy?: number,
    pic_move_x?: number, pic_move_y?: number): Server{
    var canvas_height, canvas_width;
    if( server_type == "Rackmount" || server_type == "Tower" ){
        server_obj = new Server( server_name, server_type, drive_slot,
        drive_row, drive_col, drives_type, slot_type, server_unit);
        canvas_width = server_obj.width+((server_obj.hd_z+1)*6*server_obj.server_unit)+10;
        canvas_height =server_obj.height*(1+server_obj.hd_z)+10;
        svg.size( canvas_width, canvas_height);
    } else if( server_type == "Custom" ) {
        server_obj = new Server( server_name, server_type, drive_slot,
        drive_row, drive_col, drives_type, slot_type, undefined, customx, customy);
        canvas_width = server_obj.width+10;
        canvas_height =server_obj.height+10;
        svg.size( canvas_width, canvas_height );
    }
    svg.add( server_obj.getSVG().move(pic_move_x, pic_move_y) );
    diaShapeHeader =`
<shape h="${canvas_height}" w="${canvas_width}" aspect="fixed" strokewidth="inherit">
    <connections>
        <constraint x="0" y="0" perimeter="1" />
        <constraint x="0.5" y="0" perimeter="1" />
        <constraint x="1" y="0" perimeter="1" />
        <constraint x="0" y="0.5" perimeter="1" />
        <constraint x="1" y="0.5" perimeter="1" />
        <constraint x="0" y="1" perimeter="1" />
        <constraint x="0.5" y="1" perimeter="1" />
        <constraint x="1" y="1" perimeter="1" />
    </connections>`
    return server_obj;
}

function showjson( svgstring: string ){
    let json = svgtojson( svgstring );
    let jsonview = document.getElementById("jsonstring");

    if( json && jsonview )
        jsonview.innerHTML = json;
}

function showShape( shapestring: string ){
    console.log("shape="+shapestring)
    let shapeview = document.getElementById("diastring");
    shapeview!.innerHTML = diaShapeHeader + shapestring + "</shape>";
}

function diaShapeDraw( theserver: Server){
    showShape(theserver.getShape());
}

function updateSingleSerial(driveId: string, serialNumber: string){
    const element = document.getElementById(driveId);
    if (element) {
        let title: any = element.querySelector('title');
        if (!title) {
            title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = serialNumber;
            element.appendChild(title);
        } else {
            title.textContent = serialNumber;
        }
    }
}

function updateAllSerials(serialNumber: string){
    const elements = document.getElementsByClassName('HardDrive');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let title: any = element.querySelector('title');
        if (!title) {
            title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = serialNumber;
            element.appendChild(title);
        } else {
            title.textContent = serialNumber;
        }
    }
}

function updateSerialNumber(){
    const serialNumberInput = document.getElementById("SerialNumber") as HTMLInputElement;
    const driveIdInput = document.getElementById("HardDriveID") as HTMLSelectElement;
    
    const serialNumber = serialNumberInput.value;
    const driveId = driveIdInput.value;

    if (driveId === "All") {
        updateAllSerials(serialNumber);
    } else {
        updateSingleSerial(driveId, serialNumber);
    }
}

