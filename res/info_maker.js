<script>
	const DATA = %s;

	document.addEventListener('DOMContentLoaded', function () {
		Array.from(document.querySelectorAll("p"))
		.filter((node) => node.nextSibling.nodeName === "IMG")
		.forEach((node) => {
			var code = node.children[0].name.toLowerCase();
			if (DATA[code]) {
				var targetNode = node.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
				var infoNode = document.createElement("p");
				infoNode.textContent = DATA[code];
				node.parentElement.insertBefore(infoNode, targetNode);
			}
		});
	}, false);
	
	

</script>