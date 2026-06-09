/**
 * Vision分類結果 → Drive subfolder ID / ローカルパス を解決
 * subfolder_ids は storage.yml から動的ロード
 */

import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import type { DriveClient } from "./driveClient.js";
import type { VisionClassification, SubfolderIds } from "./types.js";

interface StorageYaml {
  cloud_storage: {
    subfolder_ids: SubfolderIds;
  };
}

let cachedSubfolders: SubfolderIds | null = null;

export async function loadSubfolderIds(storageYmlPath: string): Promise<SubfolderIds> {
  if (cachedSubfolders) return cachedSubfolders;
  const text = await fs.readFile(storageYmlPath, "utf-8");
  const data = yaml.load(text) as StorageYaml;
  cachedSubfolders = data.cloud_storage.subfolder_ids;
  return cachedSubfolders;
}

/**
 * 分類結果から「Drive 上の宛先フォルダID」と「ローカルでの相対パス」を返す
 * 種別フォルダ（species/triceratops 等）が Drive に未存在ならその場で作成
 */
export async function resolveDestination(
  drive: DriveClient,
  ids: SubfolderIds,
  cls: VisionClassification
): Promise<{ driveFolderId: string; localRelativeDir: string; subPath: string }> {
  // 種が映っている → species/{species_name}/
  if (cls.species.length > 0 && !cls.species.includes("_unknown") && !cls.species.includes("_multi")) {
    const sp = cls.species[0];
    const driveFolderId = await drive.ensureFolder(ids.species, sp);
    return {
      driveFolderId,
      localRelativeDir: path.join("species", sp),
      subPath: `species/${sp}`,
    };
  }

  if (cls.species.includes("_multi")) {
    const driveFolderId = await drive.ensureFolder(ids.species, "_multi");
    return { driveFolderId, localRelativeDir: path.join("species", "_multi"), subPath: "species/_multi" };
  }

  // 環境素材
  if (cls.environment.length > 0) {
    const env = cls.environment[0];
    const idKey = `environment_${env}` as keyof SubfolderIds;
    if (ids[idKey]) {
      return {
        driveFolderId: ids[idKey],
        localRelativeDir: path.join("environment", env),
        subPath: `environment/${env}`,
      };
    }
    // 辞書外の環境（cave/swamp/museum等）は environment/ 直下に新規作成
    const driveFolderId = await drive.ensureFolder(ids.environment, env);
    return {
      driveFolderId,
      localRelativeDir: path.join("environment", env),
      subPath: `environment/${env}`,
    };
  }

  // part_close → anatomy/
  if (cls.shot === "part_close") {
    return { driveFolderId: ids.anatomy, localRelativeDir: "anatomy", subPath: "anatomy" };
  }

  // anatomical_ok が false → fallback_illustration/diagram に暫定（後で目視で再分類）
  if (!cls.anatomical_ok) {
    return {
      driveFolderId: ids.fallback_diagram,
      localRelativeDir: path.join("fallback_illustration", "diagram"),
      subPath: "fallback_illustration/diagram",
    };
  }

  // どれにも該当しない → environment/abstract（最後の砦）
  return {
    driveFolderId: ids.environment_abstract,
    localRelativeDir: path.join("environment", "abstract"),
    subPath: "environment/abstract",
  };
}

/** confidence が低い時の _uncertain/ 配置 */
export function uncertainDestination(ids: SubfolderIds): {
  driveFolderId: string;
  localRelativeDir: string;
  subPath: string;
} {
  return {
    driveFolderId: ids._uncertain,
    localRelativeDir: "_uncertain",
    subPath: "_uncertain",
  };
}

/** 次の M{NNN} ID を割り当てる */
export function nextMaterialId(existingIds: string[]): string {
  const nums = existingIds
    .map((id) => {
      const m = id.match(/^M(\d+)$/);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => n > 0);
  const next = (nums.length === 0 ? 0 : Math.max(...nums)) + 1;
  return `M${String(next).padStart(3, "0")}`;
}

/** 提案ファイル名から拡張子付きフルネーム生成 */
export function buildFinalFilename(
  suggestedStem: string,
  materialId: string,
  ext: string
): string {
  // suggestedStem例: "walk_wide_forest_dawn"
  return `${suggestedStem}_${materialId}.${ext.replace(/^\./, "")}`;
}
