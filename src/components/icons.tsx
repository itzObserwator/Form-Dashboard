"use client";

import { forwardRef, type SVGProps } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
import AnalyticsUpIcon from "@hugeicons/core-free-icons/AnalyticsUpIcon";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ArrowHorizontalIcon from "@hugeicons/core-free-icons/ArrowHorizontalIcon";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import ArrowLeft02Icon from "@hugeicons/core-free-icons/ArrowLeft02Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import ArrowRight02Icon from "@hugeicons/core-free-icons/ArrowRight02Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import BookOpen01Icon from "@hugeicons/core-free-icons/BookOpen01Icon";
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
import Camera01Icon from "@hugeicons/core-free-icons/Camera01Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import ChartLineData01Icon from "@hugeicons/core-free-icons/ChartLineData01Icon";
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";
import DropletIcon from "@hugeicons/core-free-icons/DropletIcon";
import GlassWaterIcon from "@hugeicons/core-free-icons/GlassWaterIcon";
import Dumbbell01Icon from "@hugeicons/core-free-icons/Dumbbell01Icon";
import FileVerifiedIcon from "@hugeicons/core-free-icons/FileVerifiedIcon";
import FireIcon from "@hugeicons/core-free-icons/FireIcon";
import Flag02Icon from "@hugeicons/core-free-icons/Flag02Icon";
import HeartPulseIcon from "@hugeicons/core-free-icons/HeartPulseIcon";
import Home03Icon from "@hugeicons/core-free-icons/Home03Icon";
import ImageAdd01Icon from "@hugeicons/core-free-icons/ImageAdd01Icon";
import Leaf01Icon from "@hugeicons/core-free-icons/Leaf01Icon";
import LibraryIcon from "@hugeicons/core-free-icons/LibraryIcon";
import Menu01Icon from "@hugeicons/core-free-icons/Menu01Icon";
import Moon02Icon from "@hugeicons/core-free-icons/Moon02Icon";
import UtensilsIcon from "@hugeicons/core-free-icons/UtensilsIcon";
import Notification03Icon from "@hugeicons/core-free-icons/Notification03Icon";
import PillIcon from "@hugeicons/core-free-icons/PillIcon";
import Pulse01Icon from "@hugeicons/core-free-icons/Pulse01Icon";
import RefreshIcon from "@hugeicons/core-free-icons/RefreshIcon";
import Remove01Icon from "@hugeicons/core-free-icons/Remove01Icon";
import RotateLeft01Icon from "@hugeicons/core-free-icons/RotateLeft01Icon";
import RunningShoesIcon from "@hugeicons/core-free-icons/RunningShoesIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import Settings04Icon from "@hugeicons/core-free-icons/Settings04Icon";
import ShieldCheckIcon from "@hugeicons/core-free-icons/ShieldCheckIcon";
import SmartWatch01Icon from "@hugeicons/core-free-icons/SmartWatch01Icon";
import SparkleIcon from "@hugeicons/core-free-icons/SparkleIcon";
import Target02Icon from "@hugeicons/core-free-icons/Target02Icon";
import Task01Icon from "@hugeicons/core-free-icons/Task01Icon";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import TickDouble02Icon from "@hugeicons/core-free-icons/TickDouble02Icon";
import Time04Icon from "@hugeicons/core-free-icons/Time04Icon";
import UserRoundIcon from "@hugeicons/core-free-icons/UserRoundIcon";
import UserMultipleIcon from "@hugeicons/core-free-icons/UserMultipleIcon";
import ViewIcon from "@hugeicons/core-free-icons/ViewIcon";
import ViewOffSlashIcon from "@hugeicons/core-free-icons/ViewOffSlashIcon";
import WeightScale01Icon from "@hugeicons/core-free-icons/WeightScale01Icon";
import WindPowerIcon from "@hugeicons/core-free-icons/WindPowerIcon";
import WorkoutRunIcon from "@hugeicons/core-free-icons/WorkoutRunIcon";

export type AppIconProps = Omit<SVGProps<SVGSVGElement>, "ref" | "strokeWidth"> & {
  size?: number | string;
  strokeWidth?: number;
};

/** One rounded-stroke family for every interface icon. Import named icons here. */
function createIcon(icon: IconSvgElement, name: string) {
  const Icon = forwardRef<SVGSVGElement, AppIconProps>(function AppIcon({
    size = 24,
    strokeWidth = 1.8,
    className,
    style,
    ...props
  }, ref) {
    const hasLabel = Boolean(props["aria-label"] || props["aria-labelledby"]);
    return <HugeiconsIcon
      ref={ref}
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      color="currentColor"
      className={["app-icon", className].filter(Boolean).join(" ")}
      style={{ strokeWidth, ...style }}
      aria-hidden={hasLabel ? undefined : true}
      role={hasLabel ? "img" : undefined}
      focusable="false"
      data-icon={name}
      data-icon-family="hugeicons-rounded"
      {...props}
    />;
  });
  Icon.displayName = name;
  return Icon;
}

export const Activity = /*#__PURE__*/ createIcon(Pulse01Icon, "Activity");
export const ArrowLeft = /*#__PURE__*/ createIcon(ArrowLeft02Icon, "ArrowLeft");
export const ArrowRight = /*#__PURE__*/ createIcon(ArrowRight02Icon, "ArrowRight");
export const ArrowUpRight = /*#__PURE__*/ createIcon(ArrowUpRight01Icon, "ArrowUpRight");
export const Bell = /*#__PURE__*/ createIcon(Notification03Icon, "Bell");
export const BookOpen = /*#__PURE__*/ createIcon(BookOpen01Icon, "BookOpen");
export const CalendarDays = /*#__PURE__*/ createIcon(Calendar03Icon, "CalendarDays");
export const Camera = /*#__PURE__*/ createIcon(Camera01Icon, "Camera");
export const ChartNoAxesCombined = /*#__PURE__*/ createIcon(ChartLineData01Icon, "ChartNoAxesCombined");
export const Check = /*#__PURE__*/ createIcon(Tick02Icon, "Check");
export const CheckCheck = /*#__PURE__*/ createIcon(TickDouble02Icon, "CheckCheck");
export const ChevronDown = /*#__PURE__*/ createIcon(ArrowDown01Icon, "ChevronDown");
export const ChevronLeft = /*#__PURE__*/ createIcon(ArrowLeft01Icon, "ChevronLeft");
export const ChevronRight = /*#__PURE__*/ createIcon(ArrowRight01Icon, "ChevronRight");
export const ClipboardList = /*#__PURE__*/ createIcon(Task01Icon, "ClipboardList");
export const Clock3 = /*#__PURE__*/ createIcon(Time04Icon, "Clock3");
export const Droplet = /*#__PURE__*/ createIcon(DropletIcon, "Droplet");
export const GlassWater = /*#__PURE__*/ createIcon(GlassWaterIcon, "GlassWater");
export const Dumbbell = /*#__PURE__*/ createIcon(Dumbbell01Icon, "Dumbbell");
export const Eye = /*#__PURE__*/ createIcon(ViewIcon, "Eye");
export const EyeOff = /*#__PURE__*/ createIcon(ViewOffSlashIcon, "EyeOff");
export const FileCheck2 = /*#__PURE__*/ createIcon(FileVerifiedIcon, "FileCheck2");
export const Flag = /*#__PURE__*/ createIcon(Flag02Icon, "Flag");
export const Footprints = /*#__PURE__*/ createIcon(RunningShoesIcon, "Footprints");
export const HeartPulse = /*#__PURE__*/ createIcon(HeartPulseIcon, "HeartPulse");
export const House = /*#__PURE__*/ createIcon(Home03Icon, "House");
export const ImagePlus = /*#__PURE__*/ createIcon(ImageAdd01Icon, "ImagePlus");
export const Leaf = /*#__PURE__*/ createIcon(Leaf01Icon, "Leaf");
export const LibraryBig = /*#__PURE__*/ createIcon(LibraryIcon, "LibraryBig");
export const Menu = /*#__PURE__*/ createIcon(Menu01Icon, "Menu");
export const Minus = /*#__PURE__*/ createIcon(Remove01Icon, "Minus");
export const Moon = /*#__PURE__*/ createIcon(Moon02Icon, "Moon");
export const MoveHorizontal = /*#__PURE__*/ createIcon(ArrowHorizontalIcon, "MoveHorizontal");
export const Plus = /*#__PURE__*/ createIcon(Add01Icon, "Plus");
export const RefreshCw = /*#__PURE__*/ createIcon(RefreshIcon, "RefreshCw");
export const RotateCcw = /*#__PURE__*/ createIcon(RotateLeft01Icon, "RotateCcw");
export const Scale = /*#__PURE__*/ createIcon(WeightScale01Icon, "Scale");
export const Search = /*#__PURE__*/ createIcon(Search01Icon, "Search");
export const Settings2 = /*#__PURE__*/ createIcon(Settings04Icon, "Settings2");
export const ShieldCheck = /*#__PURE__*/ createIcon(ShieldCheckIcon, "ShieldCheck");
export const Sparkles = /*#__PURE__*/ createIcon(SparkleIcon, "Sparkles");
export const Target = /*#__PURE__*/ createIcon(Target02Icon, "Target");
export const Trash2 = /*#__PURE__*/ createIcon(Delete02Icon, "Trash2");
export const TrendingUp = /*#__PURE__*/ createIcon(AnalyticsUpIcon, "TrendingUp");
export const Users = /*#__PURE__*/ createIcon(UserMultipleIcon, "Users");
export const Watch = /*#__PURE__*/ createIcon(SmartWatch01Icon, "Watch");
export const Wind = /*#__PURE__*/ createIcon(WindPowerIcon, "Wind");
export const X = /*#__PURE__*/ createIcon(Cancel01Icon, "X");
export const User = /*#__PURE__*/ createIcon(UserRoundIcon, "User");
export const Pill = /*#__PURE__*/ createIcon(PillIcon, "Pill");
export const Runner = /*#__PURE__*/ createIcon(WorkoutRunIcon, "Runner");
export const Flame = /*#__PURE__*/ createIcon(FireIcon, "Flame");
export const Food = /*#__PURE__*/ createIcon(UtensilsIcon, "Food");
