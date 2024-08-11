var twoSharingAcBx = document.getElementById("item_2_1_checkbx");
var twoSharingNonAcBx = document.getElementById("item_2_2_checkbx");
var twoSharingAttachedBathroomBx = document.getElementById("item_2_3_checkbx");

twoSharingAcBx.addEventListener('click',(e)=>{
    twoSharingFilters();
});

twoSharingNonAcBx.addEventListener('click',(e)=>{
    twoSharingFilters();
});

twoSharingAttachedBathroomBx.addEventListener('click',(e)=>{
    twoSharingFilters();
});

function twoSharingFilters(){
       var acFlag = twoSharingAcBx.checked;
       var nonAcFlag = twoSharingNonAcBx.checked;
       var attachedBathroomFlag = twoSharingAttachedBathroomBx.checked;
       var twoSharingFilterValue = "";
       if(acFlag == true && nonAcFlag == false && attachedBathroomFlag == false){
         twoSharingFilterValue = twoSharingAcBx.value;
       }
       else if(acFlag == false && nonAcFlag == true && attachedBathroomFlag == false){
        twoSharingFilterValue = twoSharingNonAcBx.value;
       }
       else if(acFlag == false && nonAcFlag == false && attachedBathroomFlag == true){
        twoSharingFilterValue = twoSharingAttachedBathroomBx.value;
       }
       else if(acFlag == true && nonAcFlag == false && attachedBathroomFlag == true){
        twoSharingFilterValue = twoSharingAcBx.value + twoSharingAttachedBathroomBx.value;
       }
       else if(acFlag == false && nonAcFlag == true && attachedBathroomFlag == true){
        twoSharingFilterValue = twoSharingNonAcBx.value + twoSharingAttachedBathroomBx.value;
       }
       else{
        alert("noooo")
       }
       console.log(twoSharingFilterValue+" filter value");
}

filtersClrBtn.addEventListener('click',(e)=>{
    twoSharingAcBx.checked = false;
    twoSharingNonAcBx.checked = false;
    twoSharingAttachedBathroomBx.checked = false;
});