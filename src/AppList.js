import React, { Component, Fragment } from 'react';
import AppCard from './AppCard';
import LibGet from './LibGet';
import loader from './img/loader.gif';
import Sidebar from './Sidebar';
import { getParams, Spacer, Mobile, stringDateToTimestamp } from './Utils';
import PlatformPicker from './PlatformPicker';
import icon from './img/icon.png';

let sorts = [{
  flavor: "by most recent",
  order: (b, a) => stringDateToTimestamp(a.updated) - stringDateToTimestamp(b.updated)
},
{
  flavor: "by download count",
  order: (b, a) => a.app_dls - b.app_dls
},
{
  flavor: "randomly",
  order: () => 0.5 - Math.random()
},
{
  flavor: "by file size",
  order: (b, a) => (a.filesize + a.filesize) - (b.filesize + b.filesize)
}];

class AppList extends Component {
  state = {
    packages: null,
    curSort: 0
  }

  constructor(props) {
    super(props);
    this.category = Sidebar.getCurrentCategory();
    const { platform, query } = getParams(props);
    this.platform = platform;
    this.query = query;
  }

  doesSearchMatch(query = "", pkg = {}) {
    const { title, description, author } = pkg;
    const searchUs = [title, description, author];
    return searchUs.filter(a => a && a.toLowerCase().indexOf(query.toLowerCase()) >= 0).length > 0;
  }

  async adjustSort(me) {
    let curSort = ((me.state.curSort + 1) % sorts.length);
    me.setState({curSort});
    await me.sortLogic(me);
  }

  static async fetchPackages(platform) {
    const repos = LibGet.getRepos(platform);

    const repoPackages = await Promise.all(
      (await LibGet.getApps(repos)).map(
        async (response) => await response.json()
      ));
    
    return repoPackages.reduce(
      (acc, cur, idx) => acc.concat(
        cur["packages"].map(pkg => ({
          ...pkg,
          repo: repos[idx].url,
          platform: repos[idx].platform
        }))
      ), []);
  }

  async componentDidMount() {
    await this.sortLogic(this);
  }

  async sortLogic(me) {
    
    let packages = await AppList.fetchPackages(this.platform);

    // perform the actual sort of packages, based on current sort / category
    packages = packages.sort(sorts[me.state.curSort].order);

    const cats = new Set(Sidebar.getAllCategories().map(cat => cat.short));

    const { short } = me.category;
    // let through for all and search, and misc only if not in any others
    packages = packages.filter(pkg => {
      return (pkg.category === short || (short === "_all" && pkg.category !== "theme")) ||
        (short === "_misc" && !cats.has(pkg.category)) ||
        (me.query);
    });

    packages = packages.filter(pkg => me.doesSearchMatch(me.query, pkg));

    me.setState({ packages, query: me.query });
  }

  render() {
    const { packages, curSort } = this.state;
    const { name } = this.category;

    if (!packages) {
      return (<div className="AppList">
        <div className="left">
          <img src={loader} alt="Loading apps..." style={{width: 270, height: 130}} />
        </div>
      </div>);
    }

    let fdbk = () => {
      window.location.href = ("mailto:fight@fortheusers.org?subject=[HBAS] App Store Feedback"); // temp link
    }

    let { flavor: sortFlavor } = sorts[curSort];

    const isOnHome = window.location.pathname === "" || window.location.pathname === "/";

    const platformPicker = isOnHome ? <div id="homeBlurb" style={{
      marginBottom: 10,
      marginLeft: 50,
      marginRight: 50,
      marginTop: 10,
      maxWidth: 1100}}>
      <div style={{padding: 10, textAlign: "center"}}>
        <img src={icon} alt="AppStore Logo" style={{ width: 64, verticalAlign: "middle" }} />
        <span style={{
          fontSize: 40,
          verticalAlign: "middle",
          padding: 10
          }}>Homebrew App Store</span>
      </div>
      <p>Homebrew App Store is a free and open-source repository of <a href="https://en.wikipedia.org/wiki/Homebrew_(video_games)">homebrew apps</a> for the Wii U and Switch consoles. The apps, tools, and games distributed here are all made by independent software developers within the community.</p>
      <p>If you would like to list your own open-source app here, or request an existing one to add to this index, please see the <a href="/submit-or-request">Submit</a> page. For other info about the team and project, see our <a href="/about">About</a> page.</p>
      <PlatformPicker />
    </div> : null;

    let headerText = (<Fragment>
      {platformPicker}
      <div className="catTitle">
        <div className="menuspan">
        {name} <br className="mobilebr"></br><span className="sort">{sortFlavor}</span>
        </div>
        <div className="menu">
              <button onClick={() => this.adjustSort(this)}>Adjust Sort</button>
              <button id="feedback" onClick={fdbk}>Leave Feedback</button>
              {/* <button onClick={help}>Help!</button>   */}
        </div>
        </div>
      </Fragment>);

    const updateURL = async (event) => {
      this.query = event.target.value;
      window.history.replaceState({}, "", `/search/${this.query}`);
      this.componentDidMount();
    }

    if (window.location.href.indexOf("/search") >= 0) {
      headerText = (
        <div className="catTitle">
          Search: <input id="searchBox" type="text" onChange={updateURL} defaultValue={this.query}>
          </input>
        </div>
      )
    }

    if (packages.length === 0) {
      return (
        <div className="AppList">
          <Mobile />
          {headerText}
          No apps found for the given {this.query ? "search query" : "category"}.
        </div>)
    }

    return (
      <div className="AppList">
        <Mobile />
        { headerText }
        {
          packages.map(pkg => {
            return (
              <a className="AppCardWrapper" href={`/${pkg.platform}/${pkg.name}`}>
                <AppCard {...pkg} key={`${pkg.name}_${pkg.repo}`} />
              </a>)
            ;
          })
        }
        {/* <FullWidthAd /> */}
        <Spacer />
      </div>
    );
  }
}

export default AppList;
