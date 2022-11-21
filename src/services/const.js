export const Stories = {
  Main:     'main_story',
  Title:    'title_story',
  Secret:   'secret_story',
}

export const Views = {
  Main: {
    Overview: 'main_overview',
    Search:   'main_search',
    List:     'main_list',
    Etc:      'main_etc'
  },
  Title: {
    Main:        'title_main',
    Authors:     'title_authors',
    Companies:   'title_companies',
    Genres:      'title_genres',
    Communities: 'title_communities',
    Links:       'title_links'
  }
}

export const Panels = {
  Main: {
    Overview: {
      Main:    'main_overview_main',
      Suggest: 'main_overview_suggest'
    },
  
    Search: {
      Main: 'main_search_main'
    },
  
    List: {
      Main: 'main_list_main'
    },

    Etc: {
      Main:     'main_etc_main',
      Settings: 'main_etc_settings',
      Feedback: 'main_etc_feedback',
      Tests:    'main_etc_tests',
      Donate:   'main_etc_donate',
    }
  }
}

export const TITLE_EDIT_MODAL = 'ted';

export const TABS_ANIME = 'anime';
export const TABS_MANGA = 'manga';
export const LIST_TABS = {
  [TABS_ANIME]: [
    { label: 'Все', key: 'all' },
    { label: 'Смотрю', key: 'watching' },
    { label: 'Закончен', key: 'completed' },
    { label: 'На паузе', key: 'on-hold' },
    { label: 'Брошено', key: 'dropped' },
    { label: 'Планируется', key: 'plan-to-watch' },
  ],
  [TABS_MANGA]: [
    { label: 'Все', key: 'all' },
    { label: 'Читаю', key: 'reading' },
    { label: 'Закончен', key: 'completed' },
    { label: 'На паузе', key: 'on-hold' },
    { label: 'Брошено', key: 'dropped' },
    { label: 'Планируется', key: 'plan-to-read' },
  ]
};

export const DefaultNavigationState = {
  activeStory: Stories.Main,
  activeViews: {
    [Stories.Main]: Views.Main.Overview,
    [Stories.Title]: Views.Title.Main
  },
  activePanels: {
    [Views.Main.Overview]: Panels.Main.Overview.Main,
    [Views.Main.Search]: Panels.Main.Search.Main,
    [Views.Main.List]: Panels.Main.List.Main,
    [Views.Main.Etc]: Panels.Main.Etc.Main,
  },
  storyHistory: [ Stories.Main ]
}