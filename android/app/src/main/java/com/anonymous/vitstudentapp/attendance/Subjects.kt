package com.anonymous.vitstudentapp.attendance

import com.anonymous.vitstudentapp.R

data class Subject(val name: String, val code: String, val attendance: Int)

object Subjects {
    val list = listOf(
        Subject("Data Structures", "CS201", 95),
        Subject("Operating Systems", "CS202", 82),
        Subject("Algorithms", "CS203", 70),
        Subject("Calculus", "MA101", 60),
        Subject("Statistics", "MA201", 50),
        Subject("Networking", "CS204", 45),
        Subject("Cyber Security", "CS301", 35),
        Subject("AI", "CS302", 25),
        Subject("Database Systems", "CS205", 88),
        Subject("Software Engineering", "CS206", 77),
    )
}

fun getBackgroundColor(p: Int): Int {
    return when {
        p >= 75 -> 0xffc8e6c9.toInt()
        p >= 70 -> 0xfffff9c4.toInt()
        else -> 0xffffcdd2.toInt()
    }
}

fun getIcon(p: Int): Int {
    return when {
        p >= 75 -> android.R.drawable.presence_online
        p >= 70 -> android.R.drawable.presence_away
        else -> android.R.drawable.presence_busy
    }
}

fun getIconColor(p: Int): Int {
    return when {
        p >= 75 -> android.graphics.Color.parseColor("#2e7d32")
        p >= 70 -> android.graphics.Color.parseColor("#f9a825")
        else -> android.graphics.Color.parseColor("#c62828")
    }
}
