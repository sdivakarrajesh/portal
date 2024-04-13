import React, { Component } from "react";
import {
  Card,
  Tag,
  Icon,
  IconSize,
  Tooltip,
  Position,
} from "@blueprintjs/core";
import { AssetAPIObject } from "@portal/api/annotation";
import VideoThumbnail from "react-video-thumbnail";
import classes from "./imagebar.module.css";
import { Grid, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import AutoSizer from "react-virtualized-auto-sizer";


function ThumbnailGenerator(
  asset: AssetAPIObject,
  index: string,
  useDarkTheme: boolean,
  clickCallback: (assetObject: AssetAPIObject) => void,
  currentAssetID: string,
  key: any,
): JSX.Element {
  return (
    <Card
      className={["image-bar-thumbnail-card", classes.Card].join(" ")}
      key={key}
      onClick={() => clickCallback(asset)}
    >
      <div
        className={
          asset.assetUrl === currentAssetID
            ? "image-bar-thumbnail image-bar-thumbnail-highlighted"
            : "image-bar-thumbnail"
        }
      >
        {asset.type === "video" ? (
          <>
            {" "}
            <Icon
              className={classes.StackTop}
              icon="video"
              iconSize={IconSize.STANDARD}
            />
            <div>
              <VideoThumbnail
                width={150}
                length={150}
                snapshotAtTime={1}
                videoUrl={asset.thumbnailUrl}
              />
            </div>
          </>
        ) : (
          <img src={asset.thumbnailUrl} alt={asset.filename} />
        )}

        <Tag
          className={["image-bar-filename-tag", classes.Tag].join(" ")}
          fill={true}
          style={{ backgroundColor: useDarkTheme ? "" : "#CED9E0" }}
          rightIcon={
            asset.isCached ? (
              <Tooltip
                content="Inference is Cached by Model"
                position={Position.TOP}
              >
                <Icon
                  icon="bookmark"
                  color={useDarkTheme ? "#0F9960" : "#3DCC91"}
                />
              </Tooltip>
            ) : (
              false
            )
          }
        >
          <span
            className={"bp3-ui-text bp3-monospace-text image-bar-filename-text"}
          >
            {asset.filename}
          </span>
        </Tag>
      </div>
    </Card>
  );
}

interface ImageBarProps {
  assetList: Array<AssetAPIObject>;
  useDarkTheme: boolean;
  /* Callbacks Package */
  callbacks: any;
}

export default class ImageBar extends Component<ImageBarProps> {
  private currentAssetID: string;
  private _cache: CellMeasurerCache

  constructor(props: ImageBarProps) {
    super(props);
    this.currentAssetID = "";
    this.highlightAsset = this.highlightAsset.bind(this);
    this._cache = new CellMeasurerCache({
      defaultWidth: 100,
      fixedHeight: true,
    });
  }

  highlightAsset(assetUrl: string): void {
    this.currentAssetID = assetUrl;
    this.forceUpdate();
  }

  render(): JSX.Element {
    return <AutoSizer>
      {({ width, height }) => {
        return (
          <Grid
            height={height}
            width={width}
            columnWidth={this._cache.columnWidth}
            columnCount={this.props.assetList.length}
            rowCount={1}
            rowHeight={120}
            overscanColumnCount={10}
            style={{overflowY: "hidden"}}
            
            cellRenderer={({ key, columnIndex, rowIndex, style, parent }) => {
              let item = this.props.assetList[columnIndex]
              console.log(style)
              return <CellMeasurer
                cache={this._cache}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
                key={key}
                parent={parent}
              >
                <div style={{margin: 10, ...style}}>
                  {ThumbnailGenerator(
                    item,
                    item.assetUrl,
                    this.props.useDarkTheme,
                    this.props.callbacks.selectAssetCallback,
                    this.currentAssetID,
                    key,
                  )}
                </div>
              </CellMeasurer>
            }}
          />
        )
      }}
    </AutoSizer>
  }
}
