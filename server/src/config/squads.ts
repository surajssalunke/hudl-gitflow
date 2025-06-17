const members = process.env.SQUAD_GITFLOW_MEMEBERS
  ? process.env.SQUAD_GITFLOW_MEMEBERS.split(",")
  : [];

const squads = {
  "squad-gitflow": {
    repos: ["hudl-gitflow", "tmp-fargo", "tmp-HudlFfmpeg"],
    members,
  },
};

export default squads;
