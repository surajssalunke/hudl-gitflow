import type { SquadInsightsResponse } from "@/types/squadInsights";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TDateRange = {
  start: Date;
  end: Date;
};

type TDashboardState = {
  activePage: string;
  member: string | null;
  repo: string | null;
  data: SquadInsightsResponse | null;
  dateRange: TDateRange;
};

const today = new Date();
const twoWeeksAgo = new Date(today);
twoWeeksAgo.setDate(today.getDate() - 14);

const initialState: TDashboardState = {
  activePage: "insights",
  member: null,
  repo: null,
  dateRange: {
    start: twoWeeksAgo,
    end: today,
  },
  data: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setActivePage: (
      state,
      action: PayloadAction<TDashboardState["activePage"]>
    ) => {
      state.activePage = action.payload;
    },
    setMember: (state, action: PayloadAction<string>) => {
      state.member = action.payload;
    },
    setRepo: (state, action: PayloadAction<string>) => {
      state.member = action.payload;
    },
    setData: (state, action: PayloadAction<TDashboardState["data"]>) => {
      state.data = action.payload;
    },
    setDateRange: (
      state,
      action: PayloadAction<TDashboardState["dateRange"]>
    ) => {
      state.dateRange.start = action.payload.start;
      state.dateRange.end = action.payload.end;
    },
  },
});

export const { setActivePage, setMember, setRepo, setData, setDateRange } =
  dashboardSlice.actions;

export const getActivePage = (state: { dashboard: TDashboardState }) =>
  state.dashboard.activePage;
export const getMember = (state: { dashboard: TDashboardState }) =>
  state.dashboard.member;
export const getRepo = (state: { dashboard: TDashboardState }) =>
  state.dashboard.repo;
export const getData = (state: { dashboard: TDashboardState }) =>
  state.dashboard.data;
export const getDateRange = (state: { dashboard: TDashboardState }) =>
  state.dashboard.dateRange;

export default dashboardSlice.reducer;
