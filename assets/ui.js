function hideUI() {
	let menu = document.getElementById("menu");
	let hide = document.getElementById("hide");
	if (menu.hidden) {
		hide.innerHTML = "Hide menu"
	} else {
		hide.innerHTML = "Show menu"
	}
	menu.hidden = !menu.hidden;
}
function showdiv(id){
	let ide = document.getElementById(id);
	let idea = document.getElementById(id+"a");
	if (ide.hidden){
		ide.hidden = false;
		idea.innerHTML = idea.innerHTML.replace("+","-")
	} else {
		ide.hidden = true;
		idea.innerHTML = idea.innerHTML.replace("-","+")
	}
}