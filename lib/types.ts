// ============================================================
// Zeitgeist API Types
// ============================================================

// --------------- Events ---------------

export type EventKind =
  | 'conflict'
  | 'diplomatic'
  | 'economic'
  | 'cyber'
  | 'humanitarian'
  | 'political'
  | 'military'
  | 'intelligence'
  | 'protest'
  | 'natural_disaster'
  | 'other';

export interface Event {
  id: string;
  kind: EventKind;
  title: string;
  summary: string;
  location: string;
  country_code: string;
  lat: number;
  lon: number;
  severity: number; // 0-100
  confidence: number; // 0-1
  occurred_at: string; // ISO 8601
  ingested_at: string; // ISO 8601
  source_urls: string[];
  tags: string[];
  related_event_ids: string[];
  theater_id?: string;
  entity_ids: string[];
}

export interface EventList {
  events: Event[];
  total: number;
  page: number;
  page_size: number;
}

// --------------- Entities ---------------

export interface AtomicFact {
  id: string;
  predicate: string;
  object: string;
  confidence: number;
  source_event_id?: string;
  created_at: string;
}

export interface Entity {
  id: string;
  name: string;
  kind: 'country' | 'organization' | 'person' | 'asset' | 'group' | 'other';
  aliases: string[];
  description: string;
  country_code?: string;
  created_at: string;
  updated_at: string;
}

export interface EntityWithFacts extends Entity {
  facts: AtomicFact[];
  related_event_ids: string[];
}

// --------------- Geopolitical ---------------

export interface CountryRisk {
  country_code: string;
  country_name: string;
  risk_score: number; // 0-100
  conflict_index: number;
  economic_stress: number;
  political_stability: number;
  cyber_threat_level: number;
  updated_at: string;
}

export interface Theater {
  id: string;
  name: string;
  description: string;
  countries: string[]; // ISO country codes
  risk_score: number;
  active_event_count: number;
  updated_at: string;
}

export interface AssetBreakdown {
  asset_id: string;
  asset_name: string;
  asset_kind: 'military' | 'economic' | 'diplomatic' | 'cyber' | 'infrastructure';
  value: number;
  risk_exposure: number;
  theater_id?: string;
  country_code?: string;
}

// --------------- Alerts & Correlations ---------------

export type AlertLevel = 'critical' | 'elevated' | 'normal' | 'info';

export interface FusedAlert {
  id: string;
  level: AlertLevel;
  title: string;
  summary: string;
  event_ids: string[];
  entity_ids: string[];
  theater_id?: string;
  created_at: string;
  expires_at?: string;
  acknowledged: boolean;
}

export interface Correlation {
  id: string;
  event_a_id: string;
  event_b_id: string;
  correlation_type: string;
  strength: number; // 0-1
  explanation: string;
  detected_at: string;
}

// --------------- World / Scenario ---------------

export interface World {
  id: string;
  name: string;
  description: string;
  is_baseline: boolean;
  parent_world_id?: string;
  diverged_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WorldList {
  worlds: World[];
  total: number;
}

export interface Agent {
  id: string;
  world_id: string;
  name: string;
  role: string;
  capabilities: string[];
  status: 'idle' | 'running' | 'paused' | 'error';
  last_run_at?: string;
  created_at: string;
}

export interface Scenario {
  id: string;
  world_id: string;
  name: string;
  description: string;
  probability: number; // 0-1
  horizon_days: number;
  risk_delta: number; // change in overall risk vs baseline
  key_drivers: string[];
  created_at: string;
  updated_at: string;
}

export interface ScenarioList {
  scenarios: Scenario[];
  total: number;
}

// --------------- System ---------------

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  version: string;
  uptime_seconds: number;
  components: Record<string, 'ok' | 'degraded' | 'down'>;
  checked_at: string;
}

export interface Briefing {
  id: string;
  world_id: string;
  generated_at: string;
  headline: string;
  executive_summary: string;
  top_alerts: FusedAlert[];
  high_risk_countries: CountryRisk[];
  active_theaters: Theater[];
  key_events: Event[];
  scenarios: Scenario[];
}
