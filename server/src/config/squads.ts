const members = process.env.SQUAD_GITFLOW_MEMBERS
  ? process.env.SQUAD_GITFLOW_MEMBERS.split(",")
  : [];

const squads = {
  "squad-gitflow": {
    repos: ["hudl-gitflow", "tmp-fargo", "tmp-HudlFfmpeg"],
    members,
  },
};

export default squads;
