"use strict";

const projectsContainer = document.querySelector('.projects__container--js');

fetch('https://api.github.com/users/klewerro/repos?sort=pushed&direction=desc')
    .then(response => response.json())
    .then(json => {
        const repos = json;
        for (const repo of repos.slice(0, 6)) {
            projectsContainer.innerHTML += repoToHtml(repo);
        }
    }).catch(err => console.log(err));


function repoToHtml(repo) {
    const { description, name, homepage, html_url} = repo;

    return ` 
    <article class="project">
    <section class="project__content">
      <img class="project__image" src="assets/img/github.svg" />
      <h3 class="project__title">${name}</h3>
    ${
        description ? `<p class="project__description">${description}</p>` : '<i>Description missing</i> 😟'
    } 
    </section>
    <footer class="project__footer">
    ${
        homepage ? `<a class="project__link project__link--demo" title="Demo: ${name}." target="_blank" rel="nofollow noreferrer" href="${homepage}">Demo</a>` : ''
    }
      <a class="project__link project__link--code" title="Source code: ${name}." target="_blank" rel="nofollow noreferrer" href="${html_url}">Github</a>
    </footer>
  </article>`;
}
