import { createMachine } from "xstate";

export default createMachine({
      "id": "PokemonViewer",
      "initial": "getPokemonList",
      "states": {
        "getPokemonList": {
          "invoke": {
            "src": "fetchCurrentPage",
            "onError": [
              {
                "target": "showError"
              }
            ],
            "onDone": [
              {
                "actions": "savePokemonList",
                "target": "showPokemonList"
              }
            ]
          }
        },
        "showError": {},
        "showPokemonList": {
          "on": {
            "SET_SELECTED_POKEMON_ID": {
              "actions": "saveSelectedPokemonID",
              "target": "getPokemon"
            }
          }
        },
        "getPokemon": {
          "invoke": {
            "src": "getSelectedPokemon",
            "onError": [
              {
                "target": "showError"
              }
            ],
            "onDone": [
              {
                "actions": "savePokemon",
                "target": "showPokemon"
              }
            ]
          }
        },
        "showPokemon": {
          "on": {
            "SET_SELECTED_POKEMON_ID": {
              "actions": "saveSelectedPokemonID",
              "target": "getPokemon"
            }
          }
        }
      },
      "on": {
        "SET_CURRENT_PAGE": {
          "actions": "saveCurrentPage",
          "target": ".getPokemonList"
        }
      }
    },
  {
    context: {
      pageCount: 0,
      pokemonList: [],
      currentPage: 0,
      selectedPokemonID: null,
      selectedPokemon: null,
      loading: false,
    },
    actions: {
      saveCurrentPage: (context, event) => {
        context.currentPage = event.page;
        context.selectedPokemon = null;
        context.selectedPokemonID = null;
      },
      savePokemon: (context, event) => {
        context.selectedPokemon = event.data;
        context.loading = false;
      },
      saveSelectedPokemonID: (context, event) => {
        context.selectedPokemonID = event.id;
      },
      savePokemonList: (context, event) => {
        context.pokemonList = event.data.list;
        context.pageCount = event.data.pageCount;
        context.loading = false;
      },
    },
    services: {
      getSelectedPokemon: (context) =>  {
        context.loading = true;
        return fetch(`/pokemon/${context.selectedPokemonID}.json`).then((res) =>
          res.json()
        )
      },
      fetchCurrentPage: (context) => {
        context.loading = true;
        return fetch(`/pages/${context.currentPage ?? 0}.json`).then((res) =>
          res.json()
        )
      },
    },
  }
);
