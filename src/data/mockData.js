import { IMAGES } from "../assets/images.js";

// SVG path data (kept JSX-free so this remains a valid .js module).
export const ICON_PATHS = {
  home: ['<path d="M3 11.5 12 4l9 7.5"/>','<path d="M5.5 10v10h13V10M9 20v-6h6v6"/>'],
  grid: ['<rect x="4" y="4" width="6" height="6" rx="1"/>','<rect x="14" y="4" width="6" height="6" rx="1"/>','<rect x="4" y="14" width="6" height="6" rx="1"/>','<rect x="14" y="14" width="6" height="6" rx="1"/>'],
  bag: ['<path d="M5 8h14l-1 12H6L5 8Z"/>','<path d="M9 9V6a3 3 0 0 1 6 0v3"/>'],
  box: ['<path d="m4 7 8-4 8 4-8 4-8-4Z"/>','<path d="M4 7v10l8 4 8-4V7M12 11v10"/>'],
  user: ['<circle cx="12" cy="8" r="4"/>','<path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>'],
  search: ['<circle cx="11" cy="11" r="7"/>','<path d="m20 20-4-4"/>'],
  arrow: ['<path d="M5 12h14M14 7l5 5-5 5"/>'],
  plus: ['<path d="M12 5v14M5 12h14"/>'],
  minus: ['<path d="M5 12h14"/>'],
  edit: ['<path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z"/>','<path d="m13.5 7 3.5 3.5"/>'],
  logout: ['<path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9"/>'],
  chevron: ['<path d="m9 6 6 6-6 6"/>'],
  check: ['<path d="m5 12 4 4L19 6"/>'],
  clock: ['<circle cx="12" cy="12" r="9"/>','<path d="M12 7v5l3 2"/>'],
  bell: ['<path d="M6 9a6 6 0 0 1 12 0c0 7 2.5 7 2.5 7h-17S6 16 6 9ZM10 20h4"/>'],
  more: ['<circle cx="5" cy="12" r="1"/>','<circle cx="12" cy="12" r="1"/>','<circle cx="19" cy="12" r="1"/>'],
  info: ['<circle cx="12" cy="12" r="9"/>','<path d="M12 11v6M12 7.5v.5"/>'],
  filter: ['<path d="M4 6h16M7 12h10M10 18h4"/>'],
  card: ['<rect x="3" y="5" width="18" height="14" rx="2"/>','<path d="M3 10h18M7 15h3"/>'],
  pin: ['<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/>','<circle cx="12" cy="9" r="2"/>']
};
export const NAV_ITEMS = [{id:"home",label:"Discover",icon:"home"},{id:"dashboard",label:"Dashboard",icon:"grid"},{id:"orders",label:"Orders",icon:"bag"},{id:"products",label:"Products",icon:"box"},{id:"profile",label:"Profile",icon:"user"}];
export const CATEGORIES = ["All dishes","Bowls","Pasta","Pizza","Salads","Desserts"];
export const DISHES = [
 {name:"Garden harvest bowl",place:"Wild & Rooted",price:18,image:IMAGES.salad,tag:"POPULAR",time:"20–25 min"},
 {name:"Wood-fired verdura",place:"Forno Verde",price:22,image:IMAGES.pizza,tag:"CHEF PICK",time:"25–30 min"},
 {name:"The family table",place:"Casa Quorda",price:26,image:IMAGES.food,tag:"NEW",time:"30–35 min"}
];
export const RECENT_ORDERS = [
 {id:"#QU-2498",customer:"Maya Lewis",initials:"ML",items:"2 items",total:"$42.00",status:"Preparing",time:"12:42 PM"},
 {id:"#QU-2497",customer:"Noah Blake",initials:"NB",items:"3 items",total:"$68.50",status:"Ready",time:"12:35 PM"},
 {id:"#QU-2496",customer:"Talia Green",initials:"TG",items:"1 item",total:"$18.00",status:"Delivered",time:"12:16 PM"},
 {id:"#QU-2495",customer:"Leo Martin",initials:"LM",items:"4 items",total:"$81.20",status:"Delivered",time:"11:58 AM"}
];
export const INITIAL_PRODUCTS = [
 {name:"Garden harvest bowl",category:"Bowls",price:"$18.00",sold:86,image:IMAGES.salad,active:true},
 {name:"Wood-fired verdura",category:"Pizza",price:"$22.00",sold:74,image:IMAGES.pizza,active:true},
 {name:"Weekend table",category:"Sharing",price:"$26.00",sold:68,image:IMAGES.food,active:true},
 {name:"Charred market plate",category:"Mains",price:"$24.00",sold:51,image:IMAGES.table,active:false}
];
export const INITIAL_CATEGORIES = [
 {id:1,name:"Mains",station:"Hot kitchen",priority:1,items:8},
 {id:2,name:"Bowls",station:"Assembly",priority:2,items:6},
 {id:3,name:"Pizza",station:"Oven",priority:2,items:5},
 {id:4,name:"Salads",station:"Cold station",priority:5,items:3},
 {id:5,name:"Pickles",station:"Cold station",priority:5,items:2}
];
