/**
 * material-ingest skill 共通型定義
 * 根拠: pipeline/config/storage.yml / material_reuse_policy.yml / 02_magnific/_tag_dictionary.yml
 */

export type Species =
  | "triceratops" | "tyrannosaurus" | "stegosaurus" | "velociraptor" | "pteranodon"
  | "brachiosaurus" | "allosaurus" | "spinosaurus" | "ankylosaurus" | "parasaurolophus"
  | "apatosaurus" | "diplodocus" | "iguanodon" | "oviraptor" | "therizinosaurus"
  | "quetzalcoatlus" | "plesiosaurus" | "mosasaurus"
  | "_multi" | "_unknown";

export type Period =
  | "triassic" | "jurassic" | "cretaceous_early" | "cretaceous_late" | "unknown";

export type Behavior =
  | "walk" | "run" | "charge" | "eat" | "rest" | "courtship" | "fight"
  | "idle" | "landscape" | "swim" | "fly" | "hunt" | "herd" | "vocalize";

export type Shot = "wide" | "medium" | "close" | "part_close" | "overhead" | "low_angle";

export type Environment =
  | "forest" | "plain" | "coast" | "river" | "volcano" | "desert"
  | "mountain" | "sky" | "underwater" | "abstract"
  | "cave" | "swamp" | "museum";

export type Light = "dawn" | "day" | "dusk" | "night" | "storm" | "fog" | "moonlit";

export type Mood = "calm" | "dreamy" | "dramatic" | "dark" | "cinematic" | "serene" | "mysterious";

export type TransitionType = "fade" | "light_burst" | "particle" | "zoom" | "morph";

export type IllustrationType = "diagram" | "reconstruction" | "fossil" | "phylogeny" | "map";

/** Vision 判定結果 */
export interface VisionClassification {
  species: Species[];
  period: Period;
  behavior: Behavior[];
  shot: Shot;
  environment: Environment[];
  light: Light;
  mood?: Mood;
  anatomical_ok: boolean;
  anatomical_notes: string;
  confidence: {
    species: number;
    period: number;
    behavior: number;
    shot: number;
    environment: number;
    light: number;
    overall: number;
  };
  suggested_filename: string;
  suggested_path: string;
  notes: string;
}

/** _index.yml の1レコード */
export interface IndexRecord {
  id: string;                          // M001 等
  file_local_preview: string;          // preview/M001.jpg
  file_cloud_path: string;             // species/triceratops/walk_wide_forest_dawn_M001.mp4
  file_cloud_id: string;               // Drive file id
  file_cloud_url: string;
  md5: string;
  size_bytes: number;
  duration_sec: number | null;
  species: Species[];
  period: Period;
  behavior: Behavior[];
  shot: Shot;
  environment: Environment[];
  light: Light;
  mood?: Mood;
  anatomical_ok: boolean;
  ingested_at: string;                 // ISO 8601
  vision_confidence: VisionClassification["confidence"];
  vision_model: string;
  used_in: string[];                   // ["EP02_scene_005"]
  notes: string;
}

/** Drive 上のサブフォルダID（storage.yml > cloud_storage.subfolder_ids） */
export interface SubfolderIds {
  _inbox: string;
  _uncertain: string;
  species: string;
  environment: string;
  anatomy: string;
  transitions: string;
  fallback_illustration: string;
  environment_forest: string;
  environment_plain: string;
  environment_coast: string;
  environment_river: string;
  environment_volcano: string;
  environment_desert: string;
  environment_mountain: string;
  environment_sky: string;
  environment_underwater: string;
  environment_abstract: string;
  transitions_fade: string;
  transitions_light_burst: string;
  transitions_particle: string;
  transitions_zoom: string;
  transitions_morph: string;
  fallback_diagram: string;
  fallback_reconstruction: string;
  fallback_fossil: string;
  fallback_phylogeny: string;
  fallback_map: string;
}

/** 重複検出結果 */
export interface DuplicateMatch {
  matched: boolean;
  method: "file_hash" | "size_name" | "visual_similarity" | "none";
  existing_id: string | null;
  existing_path: string | null;
  match_score: number;                 // 0.0 - 1.0
}

/** 処理結果（1動画あたり） */
export interface IngestResult {
  drive_file_id: string;
  original_name: string;
  size_bytes: number;
  outcome: "ingested" | "duplicate_trashed" | "uncertain" | "error";
  classification?: VisionClassification;
  duplicate?: DuplicateMatch;
  destination_path?: string;
  cost_yen: number;
  error?: string;
}

/** コストログレコード */
export interface CostLogEntry {
  timestamp: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_yen: number;
  file_processed: string;
}
