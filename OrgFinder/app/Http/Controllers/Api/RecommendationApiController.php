<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;

class RecommendationApiController extends Controller
{
    // Category-to-interest mapping for rule-based matching
    private const INTEREST_CATEGORY_MAP = [
        'Technology'           => ['Technology', 'IT', 'Computer Science'],
        'Programming'          => ['Technology', 'IT', 'Programming'],
        'Networking'           => ['Technology', 'Networking'],
        'Arts'                 => ['Arts', 'Creative'],
        'Gaming'               => ['Gaming', 'E-sports'],
        'Design'               => ['Design', 'Creative', 'Arts'],
        'Animation'            => ['Arts', 'Design', 'Creative'],
        'Cyber Security'       => ['Technology', 'Cybersecurity'],
        'Artificial Intelligence' => ['Technology', 'AI', 'Machine Learning'],
        'Analytics'            => ['Technology', 'Data Science'],
        'Machine Learning'     => ['Technology', 'AI'],
        'Innovation'           => ['Technology', 'Entrepreneurship'],
    ];

    private const SKILL_CATEGORY_MAP = [
        'Public Speaking'   => ['Leadership', 'Communication'],
        'Leadership'        => ['Leadership'],
        'Project Management'=> ['Leadership', 'Management'],
        'Arts'              => ['Arts', 'Creative'],
        'Programming'       => ['Technology', 'IT'],
        'Cybersecurity'     => ['Technology', 'Cybersecurity'],
        'UI/UX Design'      => ['Design', 'Technology'],
        'Graphic Design'    => ['Design', 'Arts'],
    ];

    private const ACTIVITY_CATEGORY_MAP = [
        'Training'    => ['Training', 'Education', 'Leadership'],
        'Forum'       => ['Communication', 'Leadership', 'Education'],
        'Seminar'     => ['Education', 'Leadership'],
        'Competition' => ['Competition', 'E-sports', 'Gaming'],
        'E-sports'    => ['E-sports', 'Gaming'],
        'Workshop'    => ['Education', 'Training', 'Creative'],
    ];

    public function index(Request $request)
    {
        $user = $request->user();

        $matchCategories = collect();

        foreach (($user->interests ?? []) as $interest) {
            $cats = self::INTEREST_CATEGORY_MAP[$interest] ?? [];
            $matchCategories = $matchCategories->merge($cats);
        }
        foreach (($user->skills ?? []) as $skill) {
            $cats = self::SKILL_CATEGORY_MAP[$skill] ?? [];
            $matchCategories = $matchCategories->merge($cats);
        }
        foreach (($user->activities ?? []) as $activity) {
            $cats = self::ACTIVITY_CATEGORY_MAP[$activity] ?? [];
            $matchCategories = $matchCategories->merge($cats);
        }

        $matchCategories = $matchCategories->unique()->values();

        $orgs = Organization::with(['photos'])
            ->whereNull('deleted_at')
            ->get();

        // Score each org
        $scored = $orgs->map(function ($org) use ($matchCategories) {
            $score = 0;
            if ($org->category && $matchCategories->contains($org->category)) {
                $score = $matchCategories->filter(fn($c) => $c === $org->category)->count();
            }
            return ['org' => $org, 'score' => $score];
        })
        ->sortByDesc('score')
        ->filter(fn($item) => $item['score'] > 0)
        ->take(10)
        ->values();

        // Fall back to all orgs if no matches
        if ($scored->isEmpty()) {
            $scored = $orgs->take(10)->map(fn($o) => ['org' => $o, 'score' => 0]);
        }

        return response()->json([
            'recommendations' => $scored->map(fn($item) => [
                'id'       => $item['org']->id,
                'name'     => $item['org']->name,
                'category' => $item['org']->category,
                'president'=> $item['org']->president,
                'mission'  => $item['org']->mission,
                'logo'     => $item['org']->logo ? asset('storage/' . $item['org']->logo) : null,
                'score'    => $item['score'],
                'match_reason' => $this->matchReason($item['org'], request()->user()),
            ])->values(),
        ]);
    }

    private function matchReason(Organization $org, $user): string
    {
        $interests = $user->interests ?? [];
        $skills    = $user->skills ?? [];

        $matched = array_merge(
            array_filter($interests, fn($i) => in_array($org->category, self::INTEREST_CATEGORY_MAP[$i] ?? [])),
            array_filter($skills, fn($s) => in_array($org->category, self::SKILL_CATEGORY_MAP[$s] ?? []))
        );

        if (empty($matched)) return "Matches your profile";

        return 'Matches your interest in ' . implode(' and ', array_unique($matched));
    }
}
