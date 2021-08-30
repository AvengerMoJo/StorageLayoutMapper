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
    }
}

let draw = SVG().addTo("#box")

window.clear = clear;
window.downloadString = downloadString;
window.drawDriveLayout = drawDriveLayout;
window.draw = draw;
window.showjson = showjson;

function clear(thedraw:any){
    thedraw.clear()
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

let ssd_type = [
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25,
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25,
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25,
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25
];
/*
let hdd_type = [
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35,
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35,
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35,
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35
];
*/

let server = new Server( "Example", BoxType.Rackmount, 24, 1, 24, ssd_type, SlotOrientation.Vertical, 2);
// let server = new Server( "Node2", BoxType.Rackmount, 24, 6, 4, hdd_type, SlotOrientation.Horizontal, 6);
// let server = new Server( "Node3", BoxType.Rackmount, 16, 16, 1, ssd_type, SlotOrientation.Horizontal, 7);
// let server = new Server( "Node4", BoxType.Rackmount, 24, 3, 4, hdd_type, SlotOrientation.Horizontal, 2 );
// let server = new Server( "Node5", BoxType.Rackmount, 16, 1, 4, hdd_type, SlotOrientation.Horizontal, 1);
// let server = new Server( "Node6", BoxType.Tower, 16, 4, 4, hdd_type, SlotOrientation.Vertical, 3);
draw.add( server.getSVG().move(5,5) );
draw.size( server.width+((server.hd_z+1)*10)+10, (server.height*(1+server.hd_z))+10);
//console.log( "Width = " + (server.width+(server.hd_z*6) +10) + " Height =" + ( server.height*(server.hd_z+2)+10));
//console.log( "Z level = " +server.hd_z  );


function drawDriveLayout( svg: any, server_name: string, server_type: BoxType, 
    drive_slot: number, drive_row: number, drive_col: number, drives_type: DriveType[],
    slot_type: SlotOrientation, server_unit?: number, customx?: number, customy?: number,
    pic_move_x?: number, pic_move_y?: number) {
    var shift_x;

    var newserver;
    if( server_type == "Rackmount" || server_type == "Tower" ){
        console.log("Rack and Tower draw!")
        newserver = new Server( server_name, server_type, drive_slot,
        drive_row, drive_col, drives_type, slot_type, server_unit);
        svg.size(newserver.width+((server.hd_z+1)*6*server_unit)+10, (server.height*(1+server.hd_z))+10);
    } else if( server_type == "Custom" ) {
        newserver = new Server( server_name, server_type, drive_slot,
        drive_row, drive_col, drives_type, slot_type, undefined, customx, customy);
        console.log("Custom box x =" + customx + " box y = " + customy);
        console.log("SVG size " + newserver.width + " x " + newserver.height );
        svg.size(newserver.width+10, newserver.height+10);
    }
    svg.add( newserver.getSVG().move(pic_move_x, pic_move_y) );
        console.log(pic_move_x + " x move," + pic_move_y + " y move !");

}

function showjson( svgstring: string ){
    let json = svgtojson( svgstring );
    let jsonview = document.getElementById("jsonstring");

    if( json && jsonview )
        jsonview.innerHTML = json;
}


