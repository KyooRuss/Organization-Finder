<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Convert existing string values to JSON arrays before changing the column type
        DB::table('organizations')->whereNotNull('category')->get()->each(function ($org) {
            $val = $org->category;
            // If it's already valid JSON array, skip
            $decoded = json_decode($val, true);
            if (!is_array($decoded)) {
                DB::table('organizations')->where('id', $org->id)
                    ->update(['category' => json_encode([$val])]);
            }
        });

        Schema::table('organizations', function (Blueprint $table) {
            $table->json('category')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->string('category')->nullable()->change();
        });
    }
};
