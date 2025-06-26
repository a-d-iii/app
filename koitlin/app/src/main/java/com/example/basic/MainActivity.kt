package com.example.basic

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.Event
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.MoreHoriz
import androidx.compose.material.icons.outlined.Restaurant
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.graphics.vector.ImageVector

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BasicApp()
        }
    }
}

data class NavItem(
    val labelRes: Int,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
)

@Composable
fun BasicApp() {
    val items = listOf(
        NavItem(R.string.home, Icons.Filled.Home, Icons.Outlined.Home),
        NavItem(R.string.planner, Icons.Filled.Event, Icons.Outlined.Event),
        NavItem(R.string.attendance, Icons.Filled.CheckCircle, Icons.Outlined.CheckCircle),
        NavItem(R.string.food, Icons.Filled.Restaurant, Icons.Outlined.Restaurant),
        NavItem(R.string.more, Icons.Filled.MoreHoriz, Icons.Outlined.MoreHoriz)
    )
    var selectedIndex by remember { mutableIntStateOf(0) }

    MaterialTheme {
        Scaffold(
            bottomBar = {
                NavigationBar {
                    items.forEachIndexed { index, item ->
                        NavigationBarItem(
                            icon = {
                                Icon(
                                    imageVector = if (index == selectedIndex) item.selectedIcon else item.unselectedIcon,
                                    contentDescription = stringResource(id = item.labelRes)
                                )
                            },
                            label = { Text(stringResource(id = item.labelRes)) },
                            selected = selectedIndex == index,
                            onClick = { selectedIndex = index }
                        )
                    }
                }
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .padding(innerPadding)
                    .fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                if (selectedIndex == 2) {
                    AttendanceScreen()
                } else {
                    Text(text = stringResource(id = items[selectedIndex].labelRes))
                }
            }
        }
    }
}

@Preview
@Composable
fun PreviewBasicApp() {
    BasicApp()
}
