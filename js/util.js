function fillToParent(el, id) {
    const parent = document.getElementById(id).getBoundingClientRect();    
    el.width = parent.width;
    el.height = parent.height;
}