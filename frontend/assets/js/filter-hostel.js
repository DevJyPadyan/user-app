// var twoSharingBx = document.getElementById("item_2_1_checkbx");
// var threeSharingBx = document.getElementById("item_2_2_checkbx");
// var fourSharingBx = document.getElementById("item_2_3_checkbx");

// var acBx = document.getElementById("item_3_1_checkbx");
// var nonacBx = document.getElementById("item_3_2_checkbx");

// twoSharingBx.addEventListener('click',(e)=>{
//     roomTypeFilters();
// });

// threeSharingBx.addEventListener('click',(e)=>{
//     roomTypeFilters();
// });

// fourSharingBx.addEventListener('click',(e)=>{
//     roomTypeFilters();
// });

// acBx.addEventListener('click',(e)=>{
//     airConditionFilters();
// });

// nonacBx.addEventListener('click',(e)=>{
//     airConditionFilters();
// });

// function roomTypeFilters(){
//        var twoSharingFlag = twoSharingBx.checked;
//        var threeSharingFlag = threeSharingBx.checked;
//        var fourSharingFlag = fourSharingBx.checked;
//        var roomTypeFilterValue = "";
//        if(twoSharingFlag == true && threeSharingFlag == false && fourSharingFlag == false){
//          roomTypeFilterValue = twoSharingBx.value;
//        }
//        else if(twoSharingFlag == false && threeSharingFlag == true && fourSharingFlag == false){
//         roomTypeFilterValue = threeSharingBx.value;
//        }
//        else if(twoSharingFlag == false && threeSharingFlag == false && fourSharingFlag == true){
//         roomTypeFilterValue = fourSharingBx.value;
//        }
//        else if(twoSharingFlag == true && threeSharingFlag == false && fourSharingFlag == true){
//         roomTypeFilterValue = twoSharingBx.value + fourSharingBx.value;
//        }
//        else if(twoSharingFlag == true && threeSharingFlag == true && fourSharingFlag == false){
//         roomTypeFilterValue = twoSharingBx.value + threeSharingBx.value;
//        }
//        else if(twoSharingFlag == false && threeSharingFlag == true && fourSharingFlag == true){
//         roomTypeFilterValue = threeSharingBx.value + fourSharingBx.value;
//        }
//        else if(twoSharingFlag == true && threeSharingFlag == true && fourSharingFlag == true){
//         roomTypeFilterValue =twoSharingBx.value + threeSharingBx.value + fourSharingBx.value;
//        }
//        else{
//         alert("No Filter")
//        }
//        console.log("Room Type filter value -"+roomTypeFilterValue);
// }

// function airConditionFilters(){
//     var acFlag = acBx.checked;
//     var nonacFlag = nonacBx.checked;
//     var airConditionFilterValue = "";
//     if(acFlag == true && nonacFlag == false){
//       airConditionFilterValue = acBx.value;
//     }
//     else if(acFlag == false && nonacFlag == true){
//      airConditionFilterValue = nonacBx.value;
//     }
//     else if(acFlag == true && nonacFlag == true){
//      airConditionFilterValue = acBx.value + nonacBx.value;
//     }
//     else{
//      alert("No Filter")
//     }
//     console.log("Air Contion filter value - "+airConditionFilterValue);
// }

// filtersClrBtn.addEventListener('click',(e)=>{
//     twoSharingBx.checked = false;
//     threeSharingBx.checked = false;
//     fourSharingBx.checked = false;

//     acBx.checked = false;
//     nonacBx.checked =  false;
// });