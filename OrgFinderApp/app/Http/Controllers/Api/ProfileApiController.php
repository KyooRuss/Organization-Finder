<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileApiController extends Controller
{
    public function complete(Request $request)
    {
        $data = $request->validate([
            'year_level'  => 'required|integer|min:1|max:5',
            'program'     => 'required|string|max:100',
            'interests'   => 'required|array|min:1|max:3',
            'skills'      => 'required|array|min:1|max:3',
            'activities'  => 'required|array|min:1|max:3',
        ]);

        $user = $request->user();
        $user->update([
            'year_level'        => $data['year_level'],
            'program'           => $data['program'],
            'interests'         => $data['interests'],
            'skills'            => $data['skills'],
            'activities'        => $data['activities'],
            'profile_completed' => true,
        ]);

        return response()->json(['user' => $this->userResource($user->fresh())]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'year_level'  => 'sometimes|integer|min:1|max:5',
            'program'     => 'sometimes|string|max:100',
            'interests'   => 'sometimes|array|min:1|max:3',
            'skills'      => 'sometimes|array|min:1|max:3',
            'activities'  => 'sometimes|array|min:1|max:3',
        ]);

        $request->user()->update($data);

        return response()->json(['user' => $this->userResource($request->user()->fresh())]);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate(['photo' => 'required|image|max:2048']);

        $user = $request->user();

        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $path = $request->file('photo')->store('profile-photos', 'public');
        $user->update(['profile_photo' => $path]);

        return response()->json([
            'profile_photo' => asset('storage/' . $path),
        ]);
    }

    private function userResource($user): array
    {
        return [
            'id'                => $user->id,
            'name'              => $user->name,
            'email'             => $user->email,
            'student_number'    => $user->student_number,
            'year_level'        => $user->year_level,
            'program'           => $user->program,
            'interests'         => $user->interests ?? [],
            'skills'            => $user->skills ?? [],
            'activities'        => $user->activities ?? [],
            'profile_completed' => $user->profile_completed,
            'profile_photo'     => $user->profile_photo
                ? asset('storage/' . $user->profile_photo)
                : null,
        ];
    }
}
