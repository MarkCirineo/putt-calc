"use client";

/**
 * Custom percentage editor (when not using a preset).
 * V1: placeholder. Full editor can add distance-band → make-% rows later.
 */
interface PercentageEditorProps {
	active: boolean;
	onToggle?: () => void;
}

export function PercentageEditor({ active, onToggle }: PercentageEditorProps) {
	if (!active) return null;
	return (
		<div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 space-y-2">
			<p className="text-sm font-medium">Custom percentages</p>
			<p className="text-sm text-neutral-600">
				Edit distance-band → make-% rows (coming soon). Use a preset for now.
			</p>
			{onToggle && (
				<button
					type="button"
					onClick={onToggle}
					className="text-sm underline text-neutral-600 hover:text-neutral-900"
				>
					Use preset instead
				</button>
			)}
		</div>
	);
}
