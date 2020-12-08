const state = {
    links: {
        default: [
            {
                id: 0,
                linktext: "kohnlehome.de",
                url: "http://kohnlehome.de",
                votes: 1,
            },
            {
                id: 1,
                linktext: "Offizielle Website der GBS",
                url: "https://gbsschulen.de",
                votes: 3,
            },
        ],
        data: [],
    }
};

const getters = {
  links: (state) => state.links,
};

const mutations = {
  setLinks(state, value) {
    state.links.data = value;
  },
};

const actions = {
    laden(context) {
        if (localStorage.getItem("links")) {
            const linksString = localStorage.getItem("links");
            context.commit('setLinks', JSON.parse(linksString));
        } else {
            context.commit('setLinks', state.links.default);
        }
    },
    speichern() {
        const linksString = JSON.stringify(state.links.data);
        localStorage.setItem("links", linksString);
    },
    hinzufuegen(context, data) {
        const links = state.links.data;
        if (data.newName != "" && data.newUrl != "") {
            const newLink = {
                linktext: data.newName,
                url: data.newUrl,
                votes: 0,
            };

            newLink.id = this.maxId + 1;
            links.push(newLink);

            context.commit('setLinks', links);
            context.dispatch('speichern');
            context.dispatch('laden');
        }
    },
    deleteLink(context, id) {
        const links = state.links.data;

        // index des zu löschenden Links ermitteln
        let index = links.findIndex((link) => link.id === id);
        // Element an der Stelle index aus Array entfernen
        links.splice(index, 1);

        context.commit('setLinks', links);
        context.dispatch('speichern');
        context.dispatch('laden');
    },
    sortieren(context) {
        const links = state.links.data;

        links.sort(function (link1, link2) {
            return link2.votes - link1.votes;
        });

        context.commit('setLinks', links);
    },
    upvote(context, id) {
        const links = state.links.data;
        //this.links[id].votes++; Funktioniert nicht, wenn umsortiert wurde
        const clickedLink = links.find((link) => link.id === id);
        clickedLink.votes++;

        context.commit('setLinks', links);
        context.dispatch('sortieren');
        context.dispatch('speichern');
        context.dispatch('laden');
    },
    maxId() {
        let maximum = -1;
        if (state.links.data.length > 0) {
            maximum = state.links.data[0].id;
            for (let i = 1; i < state.links.data.length; i++) {
                const aktuellerLink = state.links.data[i];
                if (aktuellerLink.id > maximum) {
                    maximum = aktuellerLink.id;
                }
            }
        }
        return maximum;
    },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
