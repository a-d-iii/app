package com.example.basic

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

data class Subject(val name: String, val code: String, val attendance: Int)

private val subjects = listOf(
    Subject("Data Structures", "CS201", 95),
    Subject("Operating Systems", "CS202", 82),
    Subject("Algorithms", "CS203", 70),
    Subject("Calculus", "MA101", 60),
    Subject("Statistics", "MA201", 50),
    Subject("Networking", "CS204", 45),
    Subject("Cyber Security", "CS301", 35),
    Subject("AI", "CS302", 25),
    Subject("Database Systems", "CS205", 88),
    Subject("Software Engineering", "CS206", 77)
)

private fun backgroundColor(p: Int): Color = when {
    p >= 75 -> Color(0xFFC8E6C9)
    p >= 70 -> Color(0xFFFFF9C4)
    else -> Color(0xFFFFCDD2)
}

private fun iconFor(p: Int): ImageVector = when {
    p >= 75 -> Icons.Filled.CheckCircle
    p >= 70 -> Icons.Filled.Warning
    else -> Icons.Filled.Close
}

private fun iconColor(p: Int): Color = when {
    p >= 75 -> Color(0xFF2E7D32)
    p >= 70 -> Color(0xFFF9A825)
    else -> Color(0xFFC62828)
}

@Composable
fun AttendanceScreen() {
    val rotate = remember { Animatable(0f) }
    val rScale = remember { Animatable(1f) }
    val scope = rememberCoroutineScope()

    fun refresh() {
        scope.launch {
            launch {
                rScale.animateTo(0.8f, tween(100))
                rScale.animateTo(1f, tween(100))
            }
            launch {
                rotate.animateTo(1f, tween(500, easing = LinearEasing))
                rotate.snapTo(0f)
            }
        }
    }

    MaterialTheme {
        Scaffold(
            floatingActionButton = {
                FloatingActionButton(onClick = { refresh() }) {
                    Icon(
                        imageVector = Icons.Filled.Refresh,
                        contentDescription = null,
                        modifier = Modifier
                            .scale(rScale.value)
                            .rotate(rotate.value * 360f)
                    )
                }
            }
        ) { inner ->
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier.padding(inner),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(12.dp)
            ) {
                itemsIndexed(subjects) { index, item ->
                    SubjectCard(item, index >= subjects.size - 4)
                }
            }
        }
    }
}

@Composable
private fun SubjectCard(item: Subject, isLab: Boolean) {
    val scale = remember { Animatable(0.5f) }
    LaunchedEffect(Unit) { scale.animateTo(1f, tween(400)) }

    val bg = backgroundColor(item.attendance)
    val icon = iconFor(item.attendance)
    val iconTint = iconColor(item.attendance)

    Card(
        modifier = Modifier
            .height(130.dp)
            .scale(scale.value),
        colors = CardDefaults.cardColors(containerColor = bg),
        border = if (isLab) BorderStroke(2.dp, Color(0xFF757575)) else null
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .weight(0.3f)
                    .padding(horizontal = 8.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = item.name,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF212121)
                )
                Text(
                    text = item.code,
                    fontSize = 14.sp,
                    color = Color(0xFF212121)
                )
            }
            Row(
                modifier = Modifier
                    .weight(0.7f)
                    .padding(horizontal = 8.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Bottom
            ) {
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        text = item.attendance.toString(),
                        fontSize = 42.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF212121)
                    )
                    Text(
                        text = "%",
                        fontSize = 26.sp,
                        color = Color(0xFF212121),
                        modifier = Modifier.padding(bottom = 2.dp, start = 2.dp)
                    )
                }
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconTint
                )
            }
        }
    }
}



