import React from "react";
import { Mosaic, MosaicZeroState, getNodeAtPath } from "react-mosaic-component";
import { v4 as uuidv4 } from "uuid";
import { createStore, StoreProvider, action, Action, createTypedHooks, debug } from "easy-peasy";
import { setIn, getIn } from "lodash-redux-immutability";
import { last, flow } from "lodash";

import "react-mosaic-component/react-mosaic-component.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import Tile from "../Tile";

import "./style.scss";

type UUID = string;
type URL = string;
export type TileId = UUID;
type Direction = "row" | "column";
export type Branch = "first" | "second";
export type Path = Branch[];

type InnerNode = { first: Node; second: Node; direction: Direction; splitPercentage?: number };
type Node = TileId | InnerNode;

type MosaicModel = {
  tiles: Node | null;
  urls: Record<TileId, string>;
  setTiles: Action<MosaicModel, Node | null>;
  create: Action<MosaicModel, { id?: TileId; url?: URL }>;
  update: Action<MosaicModel, { id: TileId; url: URL }>;
  split: Action<MosaicModel, { path: Path; url?: URL }>;
};

const uniqueTileId: () => TileId = uuidv4;
const defaultUrl = "https://google.com/";

const appStore = createStore<MosaicModel>({
  // TODO: restore previous
  tiles: null,
  urls: {},
  setTiles: action((state, payload) => {
    state.tiles = payload;
  }),
  create: action((state, { id: tileId, url: tileUrl }) => {
    const url = tileUrl ?? defaultUrl;
    const id = tileId ?? uniqueTileId();
    state.urls[id] = url;

    if (state.tiles === null) {
      state.tiles = id;
    } else {
      state.tiles = {
        first: state.tiles,
        second: id,
        direction: "row",
      };
    }
  }),
  update: action((state, { id, url }) => {
    state.urls[id] = url;
  }),
  split: action((state, { path, url }) => {
    console.log(path)
    const newTile = uniqueTileId();
    const current = getNodeAtPath(state.tiles, path);

    return flow(
      debug,
      (s: MosaicModel) =>
        setIn(s, ["tiles", ...path], {
          first: current,
          second: newTile,
          direction: "row",
        }),
      (s: MosaicModel) => setIn(s, ["urls", newTile], url)
    )(state);
  }),
});

const typedHooks = createTypedHooks<MosaicModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export function useAppActions() {
  return useStoreActions((actions) => actions);
}

export function useAppState() {
  return useStoreState((state) => state);
}

const Window = () => {
  const { tiles } = useAppState();
  const { setTiles, create } = useAppActions();

  return (
    <Mosaic<UUID>
      onChange={(node) => {
        setTiles(node);
        document.body.classList.add("resizing");
      }}
      onRelease={() => {
        document.body.classList.remove("resizing");
      }}
      renderTile={(id: UUID, path: any) => <Tile id={id} path={path} />}
      zeroStateView={
        <MosaicZeroState
          createNode={() => {
            const id = uniqueTileId();
            create({ id });
            return id;
          }}
        />
      }
      value={tiles}
    />
  );
};

export default () => (
  <StoreProvider store={appStore}>
    <Window />
  </StoreProvider>
);
