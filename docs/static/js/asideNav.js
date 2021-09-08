// Генерация навигации по заголовкам
const headers = document.querySelectorAll('.page__content h2');
if (headers.length) {
	const callback = function (entries) {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				document.querySelectorAll('.page__aside_navigation a').forEach((link) => link.ariaCurrent = "false");
				document.querySelector('a[href="#' + entries[0].target.textContent + '"]').ariaCurrent = "true";
			}
		});
	};
	const observer = new IntersectionObserver(callback, {
		threshold: 1.0
	});
	const headersList = document.createElement('ul');
	headersList.classList.add('page__aside_navigation');
	headersList.hidden = true;
	for (let header of headers) {
		observer.observe(header);
		const linkText = header.textContent.split('.')[0];
		header.id = linkText;
		let headersListItem = document.createElement('li');
		let anchor = document.createElement('a');
		anchor.href = '#' + linkText;
		anchor.textContent = linkText;
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			header.scrollIntoView({block: "center", behavior: "smooth"});
		})
		headersListItem.appendChild(anchor);
		headersList.appendChild(headersListItem);
	}
	document.querySelector('.page__aside').appendChild(headersList);
}
