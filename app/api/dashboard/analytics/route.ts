import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

// Define the analytics data structure
export interface DashboardItem {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
}

export interface AnalyticsData {
  totalItems: number;
  statusCounts: {
    done: number;
    inProcess: number;
  };
  typeCounts: Record<string, number>;
  reviewerCounts: Record<string, number>;
  averageTarget: number;
  averageLimit: number;
}

/**
 * GET /api/dashboard/analytics
 * 
 * Returns analytics data for the dashboard.
 * 
 * @requires Authentication - User must have a valid session
 * 
 * @returns {AnalyticsData} Analytics data including:
 * - totalItems: Total number of dashboard items
 * - statusCounts: Count of items by status (done/inProcess)
 * - typeCounts: Count of items by type
 * - reviewerCounts: Count of items by reviewer
 * - averageTarget: Average target value
 * - averageLimit: Average limit value
 * 
 * @example Response:
 * {
 *   "totalItems": 68,
 *   "statusCounts": { "done": 32, "inProcess": 36 },
 *   "typeCounts": { "Narrative": 25, "Technical content": 18, ... },
 *   "reviewerCounts": { "Eddie Lake": 8, "Jamik Tashpulatov": 7, ... },
 *   "averageTarget": 18.5,
 *   "averageLimit": 22.3
 * }
 * 
 * @throws {401} Unauthorized - No valid session
 * @throws {500} Internal Server Error - File read error or data processing error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to access analytics" },
        { status: 401 }
      );
    }

    // Load dashboard data
    const dataPath = join(process.cwd(), "app", "dashboard", "data.json");
    let dashboardItems: DashboardItem[];
    
    try {
      const fileContent = await readFile(dataPath, "utf-8");
      dashboardItems = JSON.parse(fileContent) as DashboardItem[];
    } catch (fileError) {
      console.error("Error reading dashboard data:", fileError);
      return NextResponse.json(
        { error: "Failed to load dashboard data" },
        { status: 500 }
      );
    }

    // Validate data structure
    if (!Array.isArray(dashboardItems)) {
      return NextResponse.json(
        { error: "Invalid dashboard data format" },
        { status: 500 }
      );
    }

    // Process analytics data
    const analytics: AnalyticsData = {
      totalItems: dashboardItems.length,
      statusCounts: {
        done: dashboardItems.filter(item => item.status === "Done").length,
        inProcess: dashboardItems.filter(item => item.status === "In Process").length,
      },
      typeCounts: {},
      reviewerCounts: {},
      averageTarget: 0,
      averageLimit: 0,
    };

    // Calculate type counts
    dashboardItems.forEach(item => {
      analytics.typeCounts[item.type] = (analytics.typeCounts[item.type] || 0) + 1;
    });

    // Calculate reviewer counts (excluding "Assign reviewer")
    dashboardItems.forEach(item => {
      if (item.reviewer && item.reviewer !== "Assign reviewer") {
        analytics.reviewerCounts[item.reviewer] = (analytics.reviewerCounts[item.reviewer] || 0) + 1;
      }
    });

    // Calculate averages
    const targets = dashboardItems.map(item => parseInt(item.target)).filter(target => !isNaN(target));
    const limits = dashboardItems.map(item => parseInt(item.limit)).filter(limit => !isNaN(limit));

    analytics.averageTarget = targets.length > 0 
      ? Math.round((targets.reduce((sum, target) => sum + target, 0) / targets.length) * 10) / 10
      : 0;

    analytics.averageLimit = limits.length > 0 
      ? Math.round((limits.reduce((sum, limit) => sum + limit, 0) / limits.length) * 10) / 10
      : 0;

    return NextResponse.json(analytics, { status: 200 });

  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}